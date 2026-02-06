import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createOrder } from '@/lib/cashfree';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const {
            couponId,
            paymentMethod,
            shippingAddress,
            items,
            customerPhone,
            customerEmail,
            customerName
        } = payload;

        // 1. Get Auth User
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // 2. Validate Items & Calculate Subtotal (SERVER SIDE)
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        const productIds = items.map((i: any) => i.id);
        // Cast to any to bypass stale types if needed, though product fields usually exist
        const { data: dbProducts, error: prodError } = await (supabaseAdmin
            .from('products') as any)
            .select('id, price, sale_price, is_on_sale, stock_quantity')
            .in('id', productIds);

        if (prodError || !dbProducts) {
            throw new Error("Failed to fetch products");
        }

        let calculatedSubtotal = 0;
        const finalItems = [];

        for (const item of items) {
            const dbProduct = dbProducts.find((p: any) => p.id === item.id);
            if (!dbProduct) continue; // Skip invalid items

            // Determine price with strict casting
            const rawPrice = Number(dbProduct.price);
            const rawSale = Number(dbProduct.sale_price);
            const isOnSale = dbProduct.is_on_sale;

            const unitPrice = isOnSale ? (rawSale || rawPrice) : rawPrice;

            // Log discrepancy check
            console.log(`[API] Item: ${dbProduct.id} | DB Price: ${unitPrice} | Qty: ${item.quantity}`);

            if (isNaN(unitPrice)) {
                console.error(`[API] Invalid Price for product ${dbProduct.id}`);
                continue;
            }

            calculatedSubtotal += unitPrice * Number(item.quantity);

            finalItems.push({
                product_id: dbProduct.id,
                quantity: item.quantity,
                price_at_purchase: unitPrice
            });
        }
        console.log(`[API] Calculated Subtotal: ${calculatedSubtotal}`);

        // 3. Coupon Logic
        let discountAmount = 0;
        let finalCouponId = null;

        if (couponId) {
            // Cast strictly to any because local types are definitely outdated for coupons
            const { data: coupon, error: couponError } = await (supabaseAdmin
                .from('coupons') as any)
                .select('*')
                .eq('id', couponId)
                .eq('is_active', true)
                .single();

            if (coupon && !couponError) {
                // FALLBACK for Schema Mismatch (discount_value vs value)
                const val = coupon.discount_value ?? coupon.value ?? 0;
                const type = coupon.discount_type ?? coupon.type ?? 'fixed';
                const limit = coupon.usage_limit ?? null; // simple limit check
                const min = coupon.min_purchase_amount ?? 0;
                const max = coupon.max_discount_amount ?? null;

                // Validation checks
                const now = new Date();
                const isExpired = coupon.expiry_date && new Date(coupon.expiry_date) < now;
                const isLimitReached = limit && coupon.used_count >= limit;
                const minPurchaseMet = calculatedSubtotal >= min;

                // Log for debugging
                console.log(`[API] Coupon Check: Code=${coupon.code}, Type=${type}, Val=${val}, Expired=${isExpired}, Limit=${isLimitReached}, MinMet=${minPurchaseMet}`);

                if (!isExpired && !isLimitReached && minPurchaseMet) {
                    finalCouponId = coupon.id;
                    if (type === 'percentage') {
                        discountAmount = (calculatedSubtotal * val) / 100;
                        if (max && discountAmount > max) {
                            discountAmount = max;
                        }
                    } else {
                        discountAmount = val;
                    }
                }
            }
        }

        console.log(`[API] Money Breakdown: Subtotal=${calculatedSubtotal}, Discount=${discountAmount}`);

        // 4. Shipping Logic (Free for now, but explicit)
        const shippingCost = 0;

        // 5. Final Total
        let totalAmount = calculatedSubtotal - discountAmount + shippingCost;
        if (isNaN(totalAmount) || totalAmount < 0) totalAmount = 0;

        console.log(`[API] Final: ${totalAmount} (Sub: ${calculatedSubtotal} - Disc: ${discountAmount} + Ship: ${shippingCost})`);

        // 6. ENSURE USER EXISTS (Sync)
        const { error: upsertError } = await (supabaseAdmin.from('users') as any)
            .upsert({
                id: user.id,
                email: user.email || customerEmail || null,
                phone: user.phone || customerPhone || null,
                full_name: user.user_metadata?.full_name || customerName || "Guest Member",
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (upsertError) console.error("User Upsert Warning:", upsertError);

        // 7. Create Order
        const { data: newOrder, error: orderError } = await (supabaseAdmin.from('orders') as any)
            .insert({
                user_id: user.id,
                total_amount: totalAmount, // Server calculated
                shipping_address: {
                    ...shippingAddress,
                    email: customerEmail || user.email,
                    breakdown: { // Storing breakdown for logic/display
                        subtotal: calculatedSubtotal,
                        discount: discountAmount,
                        shipping: shippingCost
                    }
                },
                status: 'pending',
                payment_status: 'pending',
                payment_method: paymentMethod || 'online',
                payment_provider: paymentMethod === 'COD' ? 'COD' : 'cashfree',
                coupon_id: finalCouponId
            })
            .select()
            .single();

        if (orderError) throw orderError;
        const orderId = newOrder.id;

        // 8. Insert Order Items
        if (finalItems.length > 0) {
            const orderItemsData = finalItems.map(item => ({
                order_id: orderId,
                ...item
            }));
            await (supabaseAdmin.from('order_items') as any).insert(orderItemsData);
        }

        // 9. Increment Coupon Usage - MOVED TO VERIFY/WEBHOOK
        // We only increment when payment is confirmed or if it is COD (handled in verify for COD too now to be safe, or here if we trust COD placement)

        // Actually, for COD, "Placement" is confirmation. So we SHOULD increment for COD here.
        if (finalCouponId && paymentMethod === 'COD') {
            await (supabaseAdmin as any).rpc('increment_coupon_usage', { p_coupon_id: finalCouponId });
        }

        // 10. Handle Response
        if (paymentMethod === 'COD') {
            return NextResponse.json({
                mode: 'COD',
                orderId: orderId
            });
        }

        // 11. Cashfree
        const cfResponse = await createOrder({
            order_amount: totalAmount,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: user.id,
                customer_phone: customerPhone || user.phone || "9999999999",
                customer_email: customerEmail || user.email || "guest@example.com",
                customer_name: customerName || user.user_metadata?.full_name || "Guest User"
            },
            order_meta: {
                return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/status?order_id={order_id}`
            }
        });

        return NextResponse.json({
            paymentSessionId: cfResponse.payment_session_id,
            orderId: orderId
        });

    } catch (err: any) {
        console.error("Create Ritual Error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}