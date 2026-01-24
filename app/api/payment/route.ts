import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin'; // Service Role client
import { cashfree } from '@/lib/cashfree';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, amount, customerPhone, customerEmail, customerName, shippingAddress } = body;

        const { data: order, error: orderError } = await (supabaseAdmin.from('orders') as any)
            .insert({
                user_id: userId,
                total_amount: amount,
                status: 'pending',
                payment_status: 'pending',
                shipping_address: shippingAddress
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 1.5 Transfer Cart Items to Order Items
        const { data } = await supabaseAdmin
            .from('carts')
            .select('id')
            .eq('user_id', userId)
            .single();

        const cart = data as { id: string } | null;

        if (!cart) {
            console.error(`Cart not found for user ${userId}`);
            throw new Error('Login to proceed with checkout');
        }

        const { data: cartItems } = await supabaseAdmin
            .from('cart_items')
            .select('*')
            .eq('cart_id', cart.id);
        
        if (cartItems && cartItems.length > 0) {
            const orderItemsData = cartItems.map((item: any) => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price_at_purchase: item.price_at_add // Assuming price hasn't changed, or use current price if preferable
            }));

            await (supabaseAdmin.from('order_items') as any).insert(orderItemsData);
        }

        // 2. Prepare Cashfree Order Request
        const request = {
            order_amount: amount,
            order_currency: "INR",
            order_id: order.id, // Links Ayuniv order to Cashfree
            customer_details: {
                customer_id: userId || "guest_user",
                customer_phone: customerPhone,
                customer_email: customerEmail,
                customer_name: customerName
            },
            order_meta: {
                // Where to return after payment completes
                return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/status?order_id={order_id}`
            }
        };

        // 3. Create Session with Cashfree
        const response = await cashfree.PGCreateOrder(request as any);
        
        return NextResponse.json({
            paymentSessionId: response.data.payment_session_id,
            orderId: order.id
        });

    } catch (err: any) {
        console.error("Cashfree API Handshake Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}