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
    console.log(`Attempting to send emails for Order ${orderId}`);
    
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
        console.error("Email Error: Could not fetch order", error);
        return;
    }

    // 2. Prepare Data
    const customerName = order.users?.full_name || "Valued Customer";
    const customerEmail = order.users?.email;
    const items = order.order_items.map((item: any) => ({
        name: item.products?.name || "Unknown Item",
        quantity: item.quantity,
        price: item.price,
        image_url: item.products?.image_urls?.[0] || ""
    }));
    
    let address = { fullName: "", addressLine: "", city: "", state: "", pincode: "", phone: "" };
    try {
        address = typeof order.shipping_address === 'string' 
            ? JSON.parse(order.shipping_address) 
            : order.shipping_address;
    } catch (e) {}

    // 3. Send Customer Email
    if (customerEmail) {
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
            console.log(`Customer email sent to ${customerEmail}`);
        } catch (e) {
            console.error("Failed to send customer email", e);
        }
    }

    // 4. Send Admin Notification
    try {
        const adminHtml = await render(AdminOrderAlert({
                orderId: order.id,
                customerName,
                email: customerEmail || "No Email",
                items,
                totalAmount: order.total_amount,
                shippingAddress: address
        }));

        await transporter.sendMail({
            from: EMAIL_SENDER,
            to: ADMIN_EMAIL,
            subject: `New Order: ${customerName} (₹${order.total_amount})`,
            html: adminHtml,
        });
        console.log(`Admin alert sent to ${ADMIN_EMAIL}`);
    } catch (e) {
        console.error("Failed to send admin email", e);
    }
}
