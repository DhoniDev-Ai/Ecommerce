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

    // Refresh the Auth Token (this triggers setAll if needed)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Optional: Add Route Protection Logic here if you ever need it
    // if (!user && request.nextUrl.pathname.startsWith('/admin')) { ... }

    return supabaseResponse
}
