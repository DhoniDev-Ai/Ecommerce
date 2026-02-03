// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { phone } = await req.json();

        if (!phone) {
            throw new Error("Phone number is required");
        }

        // Initialize Supabase Client (Service Role)
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 1. Generate OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Store in DB
        const { error: dbError } = await supabase
            .from("otp_log")
            .insert({
                phone,
                otp_code: otp,
            });

        if (dbError) {
            console.error("DB Error:", dbError);
            throw new Error("Failed to generate OTP log");
        }

        // 3. Send via Meta Graph API
        const metaToken = Deno.env.get("META_SYSTEM_USER_TOKEN");
        const metaPhoneId = Deno.env.get("META_PHONE_NUMBER_ID");
        const templateName = "ayuniv_otp"; // Switched to Utility template defined in Meta

        if (!metaToken || !metaPhoneId) {
            console.warn("Meta credentials missing, skipping actual send (Dev Mode)");
            // In dev, we might just return the OTP for testing if secrets aren't set
            return new Response(
                JSON.stringify({ success: true, message: "OTP Generated (Meta Skipped)", dev_otp: otp }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const metaResponse = await fetch(
            `https://graph.facebook.com/v17.0/${metaPhoneId}/messages`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${metaToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: phone,
                    type: "template",
                    template: {
                        name: templateName,
                        language: { code: "en" },
                        components: [
                            {
                                type: "body",
                                parameters: [
                                    { type: "text", text: otp }
                                ]
                            }
                        ]
                    }
                }),
            }
        );

        const metaData = await metaResponse.json();

        if (!metaResponse.ok) {
            console.error("Meta API Error:", metaData);
            throw new Error(`Meta API Failed: ${metaData.error?.message}`);
        }

        return new Response(
            JSON.stringify({ success: true, message: "OTP Sent" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }
});
