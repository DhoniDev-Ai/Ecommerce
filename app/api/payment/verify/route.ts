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
            .select('id, payment_method, status, payment_status, total_amount, coupon_id, shipping_address, users(email)')
            .eq('id', orderId)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Cast to any for easier access to joined fields
        const orderData = order as any;

        // 2. Handle COD Orders (Instant Success & Emails)
        // console.log(`Verify: Checking Order ${orderId} | Method: ${order.payment_method} | Status: ${order.status}`);

        // OPTIMIZATION: If order is already in a terminal state, DO NOT call Cashfree API.
        if (['succeeded', 'failed', 'cancelled'].includes(orderData.payment_status)) {
            return NextResponse.json({ status: orderData.payment_status === 'succeeded' ? 'SUCCESS' : orderData.payment_status.toUpperCase() });
        }

        if (orderData.payment_method === 'COD') {
            // Only update and send emails if it's the first confirmation (i.e., currently pending)
            if (orderData.status === 'pending') {
                console.log("Verify: Confirming COD Order");
                await (supabaseAdmin.from('orders') as any)
                    .update({
                        status: 'processing',  // Correct Enum
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', orderId);

                // Send Emails for COD
                try {
                    await sendOrderEmails(orderId);
                } catch (e) {
                    console.error("COD Email Error:", e);
                }

                // Award Affiliate Commission (COD)
                try {
                    await awardAffiliateCommission(orderData);
                } catch (e) {
                    console.error("Affiliate Commission Error (COD):", e);
                }
            }

            return NextResponse.json({ status: "SUCCESS", mode: 'COD' });
        }

        // 3. Handle Online Orders (Cashfree Verification)
        const payments = await fetchPayments(orderId);

        if (!payments || payments.length === 0) {
            // No payment attempt found (User created order but didn't pay/dropped off early)
            // Ideally we cancel it if it's old, but for now just report PENDING
            return NextResponse.json({ status: "PENDING" });
        }

        // Find the 'authoritative' payment status
        const payment = payments.find((p: any) => ["SUCCESS", "FAILED", "USER_DROPPED"
            , "CANCELLED"].includes(p.payment_status))
            || payments[0];

        // console.log(`Verify: Cashfree Status for ${orderId}:`, payment?.payment_status);

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
        const currentStatus = orderData.payment_status; // Use already fetched status

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
                    console.log(`Verify: DB Updated to ${dbPaymentStatus}`);

                    // Send Emails ONLY if Succeeded
                    if (dbPaymentStatus === 'succeeded') {
                        // --- COUPON INCREMENT LOGIC (Moved from Creation) ---
                        // Fetch order to check if coupon exists
                        if (orderData.coupon_id) {
                            console.log(`Verify: Incrementing Usage for Coupon ${orderData.coupon_id}`);
                            await (supabaseAdmin as any).rpc('increment_coupon_usage', { p_coupon_id: orderData.coupon_id });
                        }

                        console.log("Verify: Triggering Email Service");
                        try {
                            await sendOrderEmails(orderId);
                            console.log("Verify: Email Service Completed");
                        } catch (emailErr) {
                            console.error("Verify: Email Logic Failed", emailErr);
                        }

                        // Award Affiliate Commission (Online)
                        try {
                            await awardAffiliateCommission(orderData);
                        } catch (e) {
                            console.error("Affiliate Commission Error (Online):", e);
                        }
                    }
                }
            }
        }

        // --- PREPARE DATA FOR GOOGLE REVIEWS ---
        let googleData = null;
        if (cfStatus === 'SUCCESS' || orderData.payment_status === 'succeeded' || orderData.payment_method === 'COD') {
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 5); // Est. 5 days

            let email = orderData.users?.email;
            // Try to extract email from shipping address json if not in user
            if (!email && orderData.shipping_address) {
                try {
                    const addr = typeof orderData.shipping_address === 'string' ? JSON.parse(orderData.shipping_address) : orderData.shipping_address;
                    // Check for email in different possible fields (case insensitive just in case)
                    if (addr.email) email = addr.email;
                    else if (addr.customerEmail) email = addr.customerEmail;
                } catch (e) {
                    console.log("Verify: Failed to parse shipping address for email", e);
                }
            }

            googleData = {
                email: email || "",
                delivery_country: "IN",
                estimated_delivery_date: deliveryDate.toISOString().split('T')[0],
            };
        }

        return NextResponse.json({ status: cfStatus, ...googleData });

    } catch (err: any) {
        console.error("Verification Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

async function awardAffiliateCommission(order: any) {
    if (!order.coupon_id) return;

    // 1. Find Affiliate
    const { data: affiliate } = await supabaseAdmin
        .from('affiliates')
        .select('id, user_id, total_earnings, commission_rate')
        .eq('coupon_id', order.coupon_id)
        .single();

    if (!affiliate) return;

    // 2. Calculate Commission
    let shipping = 0;
    // Helper to get nested property safely
    const getShipping = (addr: any) => {
        if (!addr) return 0;
        if (typeof addr === 'string') {
            try { return JSON.parse(addr).breakdown?.shipping || 0; } catch { return 0; }
        }
        return addr.breakdown?.shipping || 0;
    };

    shipping = getShipping(order.shipping_address);

    // Net Sale = Total - Shipping
    const netSale = (order.total_amount || 0) - shipping;
    if (netSale <= 0) return;

    const rate = affiliate.commission_rate || 5.00;
    const commissionAmount = Math.floor(netSale * (rate / 100));
    const finalComm = Math.round(commissionAmount);

    if (finalComm <= 0) return;

    // 3. Record Commission
    const { error: commError } = await supabaseAdmin
        .from('affiliate_commissions')
        .insert({
            affiliate_id: affiliate.id,
            order_id: order.id,
            amount: finalComm,
            commission_rate: rate,
            status: 'pending' // Always pending initially
        });

    if (commError) {
        // If unique constraint violation (order_id + affiliate_id), we might skip
        if (commError.code === '23505') return; // Already exists
        console.error("Commission Error:", commError);
        return;
    }

    // 4. Update Affiliate Earnings
    await supabaseAdmin
        .from('affiliates')
        .update({ total_earnings: (affiliate.total_earnings || 0) + finalComm })
        .eq('id', affiliate.id);

    console.log(`Commission of ₹${finalComm} awarded to Affiliate ${affiliate.id} (Rate: ${rate}%)`);
}
