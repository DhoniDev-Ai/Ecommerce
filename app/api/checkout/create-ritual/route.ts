import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Cashfree, CFEnvironment } from 'cashfree-pg';

// Initialize Cashfree client (only if credentials are provided)
const isCashfreeConfigured = !!process.env.CASHFREE_CLIENT_ID && !!process.env.CASHFREE_CLIENT_SECRET;

const cashfree = isCashfreeConfigured 
    ? new Cashfree(
        CFEnvironment.SANDBOX, // Use CFEnvironment.PRODUCTION for live
        process.env.CASHFREE_CLIENT_ID!,
        process.env.CASHFREE_CLIENT_SECRET!
      )
    : null;

export async function POST(req: Request) {
    try {
        // Check if Cashfree is configured
        if (!isCashfreeConfigured || !cashfree) {
            return NextResponse.json({ 
                error: 'Payment gateway not configured',
                message: 'Cashfree credentials are missing. Please add CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET to your environment variables.',
                mock: true 
            }, { status: 503 });
        }

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
        const cfResponse = await cashfree.PGCreateOrder({
            order_amount: amount,
            order_currency: "INR",
            order_id: order.id,
            customer_details: {
                customer_id: user.id,
                customer_phone: user.phone || "9999999999",
                customer_email: user.email
            },
            order_meta: {
                return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?order_id={order_id}`
            }
        } as any);

        
        return NextResponse.json({ 
            paymentSessionId: cfResponse.data.payment_session_id 
        });

    } catch (err: any) {
        console.error("Cashfree Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}