import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createOrder } from '@/lib/cashfree';

export async function POST(req: Request) {
    try {
        const {
            amount,
            couponId,
            paymentMethod,
            shippingAddress,
            items,
            customerPhone,
            customerEmail,
            customerName
        } = await req.json();

        // 1. Get Auth User
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // 1.5 ENSURE USER EXISTS IN PUBLIC SCHEMA
        // The trigger might fail or lag, so we force an upsert here to satisfy FK constraints.
        const { error: upsertError } = await supabaseAdmin
            .from('users')
            .upsert({
                id: user.id,
                email: user.email || customerEmail || null,
                phone: user.phone || customerPhone || null,
                alt_phone: null,
                full_name: user.user_metadata?.full_name || customerName || "Guest Member",
                role: 'user',
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (upsertError) {
            console.error("User Upsert Failed:", upsertError);
            // We continue? If upsert fails, insert order will likely fail too, but let's try.
        }

        // 2. CHECK FOR EXISTING PENDING ORDER (Idempotency)
        // Prevent duplicates if user clicks twice or browser retries
        const { data: existingOrder } = await supabaseAdmin
            .from('orders')
            .select('id, status, payment_status')
            .eq('user_id', user.id)
            .eq('total_amount', amount)
            .eq('status', 'pending')
            .eq('payment_status', 'pending')
            .gt('created_at', new Date(Date.now() - 2 * 60 * 1000).toISOString()) // Created in last 2 mins
            .limit(1)
            .single();

        let orderId = existingOrder?.id;

        if (existingOrder) {
            console.log(`Checkout: Reusing existing pending Order ID ${orderId}`);
        } else {
            // Create New Order
            const { data: newOrder, error: orderError } = await (supabaseAdmin
                .from('orders') as any)
                .insert({
                    user_id: user.id,
                    total_amount: amount,
                    shipping_address: {
                        ...shippingAddress,
                        email: customerEmail || user.email
                    },
                    status: 'pending',
                    payment_status: 'pending',
                    payment_method: paymentMethod || 'online',
                    payment_provider: paymentMethod === 'COD' ? 'COD' : 'cashfree',
                    coupon_id: couponId || null
                })
                .select()
                .single();

            if (orderError) throw orderError;
            orderId = newOrder.id;
        }

        if (!orderId) throw new Error("Failed to generate Order ID");

        // 3. Persist Items (Only if new order, or maybe generic?)
        // Actually, if reusing order, items are likely already there.
        // But to be safe, we can skip item insertion if reusing, OR delete & re-insert.
        // For speed/simplicity, if reusing, we assume items are same (since amount matches).

        let itemsPromise = Promise.resolve();
        // Only insert items if we CREATED a new order. 
        if (!existingOrder && items && items.length > 0) {
            const orderItemsData = items.map((item: any) => ({
                order_id: orderId!, // Assert string
                product_id: item.id,
                quantity: item.quantity,
                price_at_purchase: item.price
            }));

            // @ts-ignore
            itemsPromise = (supabaseAdmin.from('order_items') as any).insert(orderItemsData).then(({ error }) => {
                if (error) console.error("Item persistence warning:", error);
            });
        }

        // 4. Handle COD
        if (paymentMethod === 'COD') {
            await itemsPromise;
            return NextResponse.json({
                mode: 'COD',
                orderId: orderId!
            });
        }

        // 5. Create Cashfree Order
        // We reuse the orderId for Cashfree too.
        // Cashfree allows creating multiple sessions for same order_id (it just updates session).
        const cfPromise = createOrder({
            order_amount: amount,
            order_currency: "INR",
            order_id: orderId!,
            customer_details: {
                customer_id: user.id,
                customer_phone: customerPhone || user.phone || "9999999999",
                customer_email: customerEmail || user.email || "",
                customer_name: customerName || user.user_metadata?.full_name || "Guest User"
            },
            order_meta: {
                return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/status?order_id={order_id}`
            }
        });

        // Await both operations (Performance Boost)
        const [_, cfResponse] = await Promise.all([itemsPromise, cfPromise]);

        return NextResponse.json({
            paymentSessionId: cfResponse.payment_session_id
        });

    } catch (err: any) {
        console.error("Cashfree Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}