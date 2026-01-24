import { NextResponse } from 'next/server';
import { cashfree } from '@/lib/cashfree';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
    try {
        const signature = req.headers.get('x-webhook-signature');
        const timestamp = req.headers.get('x-webhook-timestamp');
        const body = await req.json();

        if (!signature || !timestamp) {
            return NextResponse.json({ error: "Missing signature or timestamp" }, { status: 400 });
        }

        // Verify Signature
        // Cashfree SDK provides a method or we do it manually. 
        // For now, relying on the 'PGVerifyWebhookSignature' if available, or manual check.
        // Since we are using the 'cashfree-pg' SDK, checking usually involves:
        try {
             cashfree.PGVerifyWebhookSignature(signature, JSON.stringify(body), timestamp);
        } catch (err) {
             console.error("Webhook Signature Verification Failed", err);
             return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
        }

        const event = body.type;

        if (event === "PAYMENT_SUCCESS_WEBHOOK") {
            const orderId = body.data.order.order_id;
            const paymentStatus = body.data.payment.payment_status; // Should be SUCCESS

            if (paymentStatus === "SUCCESS") {
                 console.log(`Webhook: Payment Success for Order ${orderId}`);
                 
                 // Update Supabase
                 const { error } = await (supabaseAdmin.from('orders') as any)
                    .update({
                        status: 'processing', // Valid enum value
                        payment_status: 'succeeded',
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', orderId);

                 if (error) {
                     console.error("Webhook: Database update failed", error);
                     return NextResponse.json({ error: "Database update failed" }, { status: 500 });
                 }
            }
        }

        return NextResponse.json({ status: "ok" });

    } catch (err: any) {
        console.error("Webhook Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
