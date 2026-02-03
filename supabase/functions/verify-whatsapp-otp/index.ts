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
        const { phone, otp } = await req.json();

        if (!phone || !otp) {
            throw new Error("Phone and Code are required");
        }

        // Initialize Supabase Admin
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        // 1. Verify OTP in DB
        const { data: logs, error: logError } = await supabaseAdmin
            .from("otp_log")
            .select("*")
            .eq("phone", phone)
            .eq("otp_code", otp)
            .eq("verified", false)
            .gt("expires_at", new Date().toISOString())
            .order("created_at", { ascending: false })
            .limit(1);

        if (logError || !logs || logs.length === 0) {
            throw new Error("Invalid or Expired OTP");
        }

        // Mark as verified
        await supabaseAdmin
            .from("otp_log")
            .update({ verified: true })
            .eq("id", logs[0].id);

        // 2. Find or Create User
        const { data: { users }, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
        // basic search, inefficient for large userbases, but phone search is tricky in listUsers
        // Better: Try to get by phone? No direct "getByPhone".
        // Actually, create user will fail if exists.

        let userId;
        let user;

        // Check if user exists by trying to create (or listing)
        // listUsers doesn't support filter by phone well in older versions.
        // We'll trust "createUser" to error if exists.

        // We need a temporary password to sign them in.
        const tempPassword = `pwd_${Math.random().toString(36).slice(2)}_${Date.now()}`;

        // Try Create
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            phone: phone,
            password: tempPassword,
            phone_confirm: true,
            user_metadata: { phone_verified: true }
        });

        if (createError) {
            // Assume user exists
            // We need to find their ID.
            // We can't easily "get ID by phone" without a search.
            // Let's rely on createUser failure message or search?
            // Actually, let's try to Sign In with the temp password? No, we don't know it.

            // Strategy: Force Password Update.
            // But we need the ID.
            // How to get ID from Phone?
            // Admin `listUsers`?
            // Or `supabase.from('users').select('id').eq('phone', phone)`? No, that's public table.
            // Auth schema is protected.

            // WORKAROUND: We shouldn't use listUsers loop (slow).
            // If we can't get ID, we can't update password.

            // Wait! `createUser` error might return the ID in some versions? No.

            // Okay, use the public `users` table mapping if available?
            // You have a trigger that syncs auth.users -> public.users.
            const { data: publicUser } = await supabaseAdmin
                .from('users') // This exists in your schema!
                .select('id')
                .eq('phone', phone)
                .single();

            if (!publicUser) {
                throw new Error("User exists in Auth but not in Public Table. Manual intervention needed or Sync issue.");
            }
            userId = publicUser.id;

            // Update Password
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                userId,
                { password: tempPassword }
            );
            if (updateError) throw updateError;

        } else {
            userId = newUser.user.id;
        }

        // 3. Login to get Session
        // We use the Public Anon Key client for sign in? Or the Admin client?
        // Admin client sign in returns session too.
        const { data: sessionData, error: loginError } = await supabaseAdmin.auth.signInWithPassword({
            phone: phone,
            password: tempPassword
        });

        if (loginError) throw loginError;

        // 4. Return Session
        return new Response(
            JSON.stringify({
                success: true,
                session: sessionData.session,
                user: sessionData.user
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );

    } catch (error: any) {
        console.error("Verify Error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }
});
