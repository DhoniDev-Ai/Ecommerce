import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createOrder } from '@/lib/cashfree';

export async function POST(req: Request) {
    try {
        const { addressId, amount, couponId } = await req.json();
        
        // 1. Get Auth User
        const authHeader = req.headers.get('Authorization');
        const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader?.split(' ')[1]!);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // 2. Create Order in Supabase
        const { data: order, error: orderError } = await (supabaseAdmin
            .from('orders') as any)
            .insert({
                user_id: user.id,
                total_amount: amount,
                shipping_address_id: addressId,
                status: 'pending',
                payment_status: 'pending',
                coupon_id: couponId || null
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 3. Create Cashfree Order Session
        const cfResponse = await createOrder({
            order_amount: amount,
            order_currency: "INR",
            order_id: order.id,
            customer_details: {
                customer_id: user.id,
                customer_phone: user.phone || "9999999999",
                customer_email: user.email || "",
                customer_name: user.user_metadata?.full_name || "Guest User"
            },
            order_meta: {
                return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?order_id={order_id}`
            }
        });

        
        return NextResponse.json({ 
            paymentSessionId: cfResponse.payment_session_id 
        });

    } catch (err: any) {
        console.error("Cashfree Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}