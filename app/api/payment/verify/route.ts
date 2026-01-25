import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { fetchPayments } from '@/lib/cashfree';
import { sendOrderEmails } from '@/lib/email';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
        return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    try {
        // 1. Ask Cashfree for the truth
        const payments = await fetchPayments(orderId);
        
        // 2. Determine Payment Status
        // Cashfree generic statuses: SUCCESS, FLAGGED, PENDING, FAILED, USER_DROPPED, VOID, CANCELLED
        const payment = payments.find((p: any) => ["SUCCESS", "FAILED", "USER_DROPPED", "CANCELLED"].includes(p.payment_status)) 
                        || payments[0];

        const cfStatus = payment?.payment_status || "PENDING";
        let dbPaymentStatus = "pending";
        let dbOrderStatus = "pending";

        if (cfStatus === "SUCCESS") {
            dbPaymentStatus = "succeeded"; 
            dbOrderStatus = "processing";
        } else if (["FAILED", "USER_DROPPED", "CANCELLED"].includes(cfStatus)) {
            dbPaymentStatus = "failed";
            dbOrderStatus = "cancelled";
        }

        // 3. Update Supabase if final status
        if (dbPaymentStatus !== "pending") {
            // Check current status to avoid duplicate emails on refresh
            const { data: currentOrder } = await supabaseAdmin
                .from('orders')
                .select('payment_status')
                .eq('id', orderId)
                .single();

            // Cast payment_status to string/any to avoid strict enum mismatch during comparison
            const currentStatus = currentOrder?.payment_status as string;

            if (currentStatus !== 'succeeded' && currentStatus !== 'paid') {
                const { error } = await (supabaseAdmin.from('orders') as any)
                    .update({ 
                        status: dbOrderStatus, 
                        payment_status: dbPaymentStatus,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', orderId);
                
                if (error) {
                    console.error(`Supabase update failed for status ${dbPaymentStatus}:`, error);
                } else if (dbPaymentStatus === 'succeeded') {
                    // Send Emails only on fresh success
                    await sendOrderEmails(orderId);
                }
            }
        }

        return NextResponse.json({ status: cfStatus });
    } catch (err: any) {
        console.error("Payment Verification Failed:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
