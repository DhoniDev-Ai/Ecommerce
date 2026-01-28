import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
    try {
        const { orderId, reason } = await req.json();

        // 1. Verify User
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
        if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // 2. Fetch Order to verify ownership and current status
        const { data: order, error: fetchError } = await (supabaseAdmin.from('orders') as any)
            .select('user_id, status, payment_status, payment_method')
            .eq('id', orderId)
            .single();

        if (fetchError || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

        if (order.user_id !== user.id) {
            return NextResponse.json({ error: 'Unauthorized access to order' }, { status: 403 });
        }

        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
            return NextResponse.json({ error: `Cannot cancel order with status: ${order.status}` }, { status: 400 });
        }

        // 3. Update Order Status
        const updateData: any = {
            status: 'cancelled',
            cancellation_reason: reason || 'User cancelled'
        };

        const { error: updateError } = await (supabaseAdmin.from('orders') as any)
            .update(updateData)
            .eq('id', orderId);

        if (updateError) throw updateError;
        
        // 4. Send Cancellation Emails (Non-blocking)
        // Manual Refund Policy: Admin confirms cancel -> Issues Refund via Dashboard
        const isPaid = order.payment_status === 'paid' || order.payment_status === 'succeeded';
        const isOnline = order.payment_method === 'online';
        
        const refundStatusText = (isPaid && isOnline) 
            ? "Refund Pending (Subject to Admin Approval)" 
            : "No Refund Required";
            
        const isCod = order.payment_method === 'COD';
        
        try {
            const { sendCancellationEmails } = await import('@/lib/email');
            sendCancellationEmails(orderId, reason || "User Cancelled", refundStatusText, isCod)
                .catch(err => console.error("Cancellation Email Error:", err));
        } catch (e) {
            console.error("Failed to import email service", e);
        }

        // Return success (no refund data needed anymore)
        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Cancel Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
