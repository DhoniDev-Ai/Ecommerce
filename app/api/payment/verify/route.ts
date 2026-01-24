import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { cashfree } from '@/lib/cashfree';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
        return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    try {
        // 1. Ask Cashfree for the truth
        const cfResponse = await cashfree.PGOrderFetchPayments(orderId);
        
        // 2. If paid, update your Supabase Sanctuary
        // Note: fetchPayments returns a list. we check the latest or success one.
        // 2. Determine Payment Status
        // Cashfree generic statuses: SUCCESS, FLAGGED, PENDING, FAILED, USER_DROPPED, VOID, CANCELLED
        const payment = cfResponse.data.find((p: any) => ["SUCCESS", "FAILED", "USER_DROPPED", "CANCELLED"].includes(p.payment_status)) 
                        || cfResponse.data[0];

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
            const { error } = await (supabaseAdmin.from('orders') as any)
                .update({ 
                    status: dbOrderStatus, 
                    payment_status: dbPaymentStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId);
            
            if (error) {
                console.error(`Supabase update failed for status ${dbPaymentStatus}:`, error);
                // Fallback: If 'succeeded' fails, maybe try 'paid'? (User said paid failed too)
                // We'll trust the logs if this fails.
            }
        }

        return NextResponse.json({ status: cfStatus });
    } catch (err: any) {
        console.error("Payment Verification Failed:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
