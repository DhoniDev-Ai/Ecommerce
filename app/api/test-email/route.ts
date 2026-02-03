import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(req: Request) {
    try {
        console.log("Test Email: Starting...");
        console.log("Host:", process.env.SMTP_HOST);
        console.log("Port:", process.env.SMTP_PORT);
        console.log("User:", process.env.SMTP_USER);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.hostinger.com',
            port: Number(process.env.SMTP_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            debug: true, // Show debug output
            logger: true // Log to console
        });

        const verifyConn = await transporter.verify();
        console.log("Test Email: Connection Verified", verifyConn);

        const info = await transporter.sendMail({
            from: `"Test Debug" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, // Send to self/admin
            subject: "SMTP Configuration Test 🚀",
            text: "If you are reading this, your SMTP configuration is CORRECT!",
            html: "<h1>SMTP Works!</h1><p>If you are reading this, your SMTP configuration is <b>CORRECT</b>.</p>"
        });

        return NextResponse.json({
            status: "SUCCESS",
            message: "Email sent successfully",
            messageId: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        });

    } catch (error: any) {
        console.error("Test Email: FAILED", error);
        return NextResponse.json({
            status: "FAILED",
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
