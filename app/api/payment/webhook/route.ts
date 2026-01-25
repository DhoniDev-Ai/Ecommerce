import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/cashfree';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendOrderEmails } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const signature = req.headers.get('x-webhook-signature');
        const timestamp = req.headers.get('x-webhook-timestamp');
        const rawBody = await req.text(); // Need raw body for signature verification

        if (!signature || !timestamp) {
            return NextResponse.json({ error: "Missing signature or timestamp" }, { status: 400 });
        }

        // Verify Signature
        try {
            verifyWebhookSignature(signature, rawBody, timestamp);
        } catch (err) {
             console.error("Webhook Signature Verification Failed", err);
             return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
        }
        
        const body = JSON.parse(rawBody);

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

                 // Send Emails
                 await sendOrderEmails(orderId);
            }
        }

        return NextResponse.json({ status: "ok" });

    } catch (err: any) {
        console.error("Webhook Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
