import crypto from "crypto";
import { Agent, setGlobalDispatcher } from 'undici';

// Configure global dispatcher with longer timeouts and forced IPv4 preferences if needed
const agent = new Agent({
  connect: {
    timeout: 30000, // 30 seconds
  },
  bodyTimeout: 30000,
});

setGlobalDispatcher(agent);

interface OrderData {
    order_amount: number;
    order_currency: string;
    order_id: string;
    customer_details: {
        customer_id: string;
        customer_phone: string;
        customer_email: string;
        customer_name: string;
    };
    order_meta: {
        return_url: string;
    };
}

export const createOrder = async (orderData: OrderData) => {
const isProd = process.env.CASHFREE_ENV === "PRODUCTION";
    const BASE_URL = isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
    const url = `${BASE_URL}/orders`;
    
    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
        throw new Error("Cashfree keys are missing in environment variables");
    }

    const headers = {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Cashfree API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        return data; // This should contain payment_session_id directly
    } catch (error) {
        //console.error("Cashfree Create Order Error:", error);
        throw error;
    }
};

export const fetchPayments = async (orderId: string) => {
    const isProd = process.env.CASHFREE_ENV === "PRODUCTION";
    const BASE_URL = isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
    const url = `${BASE_URL}/orders/${orderId}/payments`;

    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
        throw new Error("Cashfree keys are missing in environment variables");
    }

    const headers = {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY
    };

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Cashfree Verification Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        return data; // Returns array of payments
    } catch (error) {
        //console.error("Cashfree Fetch Payments Error:", error);
        throw error;
    }
};

export const verifyWebhookSignature = (signature: string, rawBody: string, timestamp: string) => {
    if (!process.env.CASHFREE_SECRET_KEY) {
        throw new Error("Cashfree secret key is missing");
    }

    const data = timestamp + rawBody;
    const generatedSignature = crypto
        .createHmac("sha256", process.env.CASHFREE_SECRET_KEY)
        .update(data)
        .digest("base64");

    if (generatedSignature !== signature) {
        throw new Error("Invalid Webhook Signature");
    }
    
    return true;
};
