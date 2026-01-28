import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { supabaseAdmin } from './supabase/admin';
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmation';
import { AdminOrderAlert } from '@/components/emails/AdminOrderAlert';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const EMAIL_SENDER = `"Ayuniv Orders" <${process.env.SMTP_USER}>`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "onlyego1043@@gmail.com"; 

export async function sendOrderEmails(orderId: string) {
    //console.log(`Attempting to send emails for Order ${orderId}`);
    
    // 1. Fetch Order Details with Products
    const { data: orderStart, error } = await supabaseAdmin
        .from('orders')
        .select(`
            *,
            users (full_name, email),
            order_items (
                quantity,
                price: price_at_purchase,
                products (name, image_urls)
            )
        `)
        .eq('id', orderId)
        .single();
    
    // Cast to any to bypass strict join typing issues
    const order = orderStart as any;

    if (error || !order) {
        //console.error("Email Error: Could not fetch order", error);
        return;
    }

    // 2. Prepare Data
    const customerName = order.users?.full_name || "Valued Customer";
    
    let address = { fullName: "", addressLine: "", city: "", state: "", pincode: "", phone: "", email: "" };
    try {
        address = typeof order.shipping_address === 'string' 
            ? JSON.parse(order.shipping_address) 
            : order.shipping_address;
    } catch (e) {}

    // Robust Email Discovery Strategy
    let customerEmail = order.users?.email;
    let emailSource = "Database Join";

    if (!customerEmail && address.email) {
        customerEmail = address.email;
        emailSource = "Shipping Address JSON";
    }

    if (!customerEmail && order.user_id) {
        // Fallback to Auth Admin API
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
        if (authUser?.user?.email) {
            customerEmail = authUser.user.email;
            emailSource = "Supabase Auth Admin";
        }
    }

    if (customerEmail) {
        console.log(`Email Service: Discovery Success via ${emailSource}: ${customerEmail}`);
    } else {
        console.error(`Email Service: CRITICAL FAILURE - Could not find email for Order ${orderId} (User ${order.user_id})`);
    }

    const items = order.order_items.map((item: any) => ({
        name: item.products?.name || "Unknown Item",
        quantity: item.quantity,
        price: item.price,
        image_url: item.products?.image_urls?.[0] || ""
    }));

    // 3. Send Customer Email
    if (customerEmail) {
        console.log(`Email Service: Sending confirmation to ${customerEmail} for Order #${order.id.slice(0, 8)}`);
        try {
            const emailHtml = await render(OrderConfirmationEmail({
                orderId: order.id,
                customerName,
                items,
                totalAmount: order.total_amount,
                shippingAddress: address
            }));

            await transporter.sendMail({
                from: EMAIL_SENDER,
                to: customerEmail,
                subject: `Order Confirmed #${order.id.slice(0, 8)} - Ayuniv`,
                html: emailHtml,
            });
            console.log(`Email Service: Customer email sent successfully`);
        } catch (e) {
            console.error("Email Service: Failed to send customer email", e);
        }
    } else {
        console.warn(`Email Service: NO EMAIL FOUND for User ID ${order.user_id}. check public.users table.`);
    }

    // 4. Send Admin Notification
    try {
        const adminHtml = await render(AdminOrderAlert({
                orderId: order.id,
                customerName,
                email: customerEmail || "No Email",
                items,
                totalAmount: order.total_amount,
                shippingAddress: address,
                paymentMethod: order.payment_method === 'COD' ? 'COD' : 'Online'
        }));

        await transporter.sendMail({
            from: EMAIL_SENDER,
            to: ADMIN_EMAIL,
            subject: `New Order: ${customerName} (₹${order.total_amount})`,
            html: adminHtml,
        });
        //console.log(`Admin alert sent to ${ADMIN_EMAIL}`);
    } catch (e) {
        //console.error("Failed to send admin email", e);
        //console.error("Failed to send admin email", e);
    }
}

import { OrderCancellationEmail } from '@/components/emails/OrderCancellation';
import { AdminCancellationAlert } from '@/components/emails/AdminCancellation';

export async function sendCancellationEmails(orderId: string, reason: string, refundStatus: string, isCod: boolean) {
    // 1. Fetch Order Details for Context
    const { data: orderStart, error } = await supabaseAdmin
        .from('orders')
        .select(`
            *,
            users (full_name, email, phone),
            order_items (
                quantity,
                price: price_at_purchase,
                products (name, image_urls)
            )
        `)
        .eq('id', orderId)
        .single();
    
    // Cast to any to bypass strict join typing issues
    const order = orderStart as any;

    if (error || !order) {
        console.error("Email Error: Could not fetch order for cancellation", error);
        return;
    }

    // 2. Prepare Data
    const customerName = order.users?.full_name || "Valued Customer";
    
    let address = { fullName: "", addressLine: "", city: "", state: "", pincode: "", phone: "", email: "" };
    try {
        address = typeof order.shipping_address === 'string' 
            ? JSON.parse(order.shipping_address) 
            : order.shipping_address;
    } catch (e) {}

    // Robust Email Discovery Strategy (Copied from sendOrderEmails for consistency)
    let customerEmail = order.users?.email;
    let emailSource = "Database Join";

    if (!customerEmail && address.email) {
        customerEmail = address.email;
        emailSource = "Shipping Address JSON";
    }

    if (!customerEmail && order.user_id) {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
        if (authUser?.user?.email) {
            customerEmail = authUser.user.email;
            emailSource = "Supabase Auth Admin";
        }
    }

    if (customerEmail) {
        console.log(`Cancellation Email Service: Discovery Success via ${emailSource}: ${customerEmail}`);
    } else {
        console.error(`Cancellation Email Service: CRITICAL FAILURE - Could not find email for Order ${orderId}`);
    }
    const customerPhone = order.users?.phone || "No Phone";
    
    const items = order.order_items.map((item: any) => ({
        name: item.products?.name || "Unknown Item",
        quantity: item.quantity,
        price: item.price,
        image_url: item.products?.image_urls?.[0] || ""
    }));


    // 3. Send Customer Email
    if (customerEmail) {
        try {
            const emailHtml = await render(OrderCancellationEmail({
                orderId: order.id,
                customerName,
                items,
                totalAmount: order.total_amount,
                reason,
                refundStatus
            }));

            await transporter.sendMail({
                from: EMAIL_SENDER,
                to: customerEmail,
                subject: `Order Cancelled #${order.id.slice(0, 8)} - Ayuniv`,
                html: emailHtml,
            });
        } catch (e) {
            console.error("Failed to send cancellation email to user", e);
        }
    }

    // 4. Send Admin Notification
    try {
        const adminHtml = await render(AdminCancellationAlert({
            orderId: order.id,
            customerName,
            email: customerEmail || "No Email",
            phone: customerPhone,
            reason,
            totalAmount: order.total_amount,
            refundStatus,
            isCod,
            items // Pass items here
        }));

        await transporter.sendMail({
            from: EMAIL_SENDER,
            to: ADMIN_EMAIL, // Defined at top of file
            subject: `CANCELLED: Order #${order.id.slice(0, 8)} - ${customerName}`,
            html: adminHtml,
        });
    } catch (e) {
        console.error("Failed to send admin cancellation alert", e);
    }
}
