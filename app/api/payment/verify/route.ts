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
        // 1. Fetch Order from DB first (Optimization)
        const { data: order, error: fetchError } = await supabaseAdmin
            .from('orders')
            .select('id, payment_method, status, payment_status')
            .eq('id', orderId)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // 2. Handle COD Orders (Instant Success & Emails)
        console.log(`Verify: Checking Order ${orderId} | Method: ${order.payment_method} | Status: ${order.status}`);

        if (order.payment_method === 'COD') {
            // Only update and send emails if it's the first confirmation (i.e., currently pending)
            if (order.status === 'pending') {
                console.log("Verify: Confirming COD Order");
                await (supabaseAdmin.from('orders') as any)
                    .update({ 
                        status: 'processing',  // Correct Enum
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', orderId);

                // Send Emails for COD (Background - don't await to keep UI fast)
                sendOrderEmails(orderId).catch(err => console.error("Background Email Error:", err));
            }
            
            return NextResponse.json({ status: "SUCCESS", mode: 'COD' });
        }

        // 3. Handle Online Orders (Cashfree Verification)
        const payments = await fetchPayments(orderId);
         // Find the 'authoritative' payment status
        const payment = payments.find((p: any) => ["SUCCESS", "FAILED", "USER_DROPPED", "CANCELLED"].includes(p.payment_status)) 
                        || payments[0];
        
        console.log(`Verify: Cashfree Status for ${orderId}:`, payment?.payment_status);

        const cfStatus = payment?.payment_status || "PENDING";
        let dbPaymentStatus = "pending";
        let dbOrderStatus = "pending";

        if (cfStatus === "SUCCESS") {
            dbPaymentStatus = "succeeded";        // Correct Enum (Matches DB)
            dbOrderStatus = "processing";     // Correct Enum
        } else if (["FAILED", "USER_DROPPED", "CANCELLED"].includes(cfStatus)) {
            dbPaymentStatus = "failed";
            dbOrderStatus = "cancelled";
        }

        // Update Supabase if status changed
        const currentStatus = order.payment_status; // Use already fetched status

        if (dbPaymentStatus !== "pending" && dbPaymentStatus !== currentStatus) {
            console.log(`Verify: Updating DB from ${currentStatus} to ${dbPaymentStatus}`);
            
            // Avoid re-updating if already succeeded (idempotency)
            if (currentStatus !== 'succeeded') {
                const { error: updateError } = await (supabaseAdmin.from('orders') as any)
                    .update({ 
                        status: dbOrderStatus, 
                        payment_status: dbPaymentStatus,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', orderId);
                
                if (updateError) {
                    console.error("Verify: DB Update FAILED", updateError);
                } else {
                    console.log("Verify: DB Update SUCCESS");
                    
                    // Send Emails only on fresh success (Background - don't await)
                    if (dbPaymentStatus === 'succeeded') {
                        console.log("Verify: Triggering Email Service");
                        sendOrderEmails(orderId).catch(err => console.error("Background Email Error:", err));
                    }
                }
            }
        }

        return NextResponse.json({ status: cfStatus });

    } catch (err: any) {
        console.error("Verification Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
