import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // Create an initial response object that we can attach cookies to
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Create the Supabase client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // 1. Update the request cookies (so Server Components see the new state)
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )

                    // 2. Refresh the response object to include new request state
                    supabaseResponse = NextResponse.next({
                        request,
                    })

                    // 3. Update the response cookies (so the Browser sees the new state)
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Check if we have any Supabase cookies before making an API call
    const cookieStore = request.cookies;
    const allCookies = cookieStore.getAll();
    const hasSupabaseCookies = allCookies.some(cookie =>
        cookie.name.includes('sb-') || cookie.name.includes('supabase')
    );

    // Only refresh the Auth Token if we potentially have a session
    // Only refresh the Auth Token if we potentially have a session
    if (hasSupabaseCookies) {
        const path = request.nextUrl.pathname;
        const isAdmin = path.startsWith('/admin');
        const isProtected = isAdmin || path.startsWith('/dashboard') || path.startsWith('/checkout') || path.startsWith('/api/user');

        if (isProtected) {
            if (isAdmin) {
                // Admin Routes: Strict security (validates against DB to check for bans/revocation immediately)
                await supabase.auth.getUser();
            } else {
                // Customer Routes: Use getSession() for speed (validates JWT signature)
                // This reduces latency by ~3-4s on slow connections compared to getUser()
                // RLS policies still protect data if the token is invalid
                await supabase.auth.getSession();
            }
        } else {
            // Public Routes: Use getSession() for speed (validates JWT signature & refreshes token)
            // This prevents the "Logged Out" flicker without the latency of a DB call.
            await supabase.auth.getSession();
        }
    }

    // Optional: Add Route Protection Logic here if you ever need it
    // if (!user && request.nextUrl.pathname.startsWith('/admin')) { ... }

    return supabaseResponse
}
