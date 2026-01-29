"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        const checkAdmin = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!mounted) return;

                if (!session) {
                    console.log("AdminGuard: No session, redirecting.");
                    router.push('/');
                    return;
                }

                // Optimization: Check for 'admin' role in cached user metadata if possible, 
                // but for security we should hit the DB.
                const { data: userRole } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (!mounted) return;

                if (userRole?.role === 'admin') {
                    setAuthorized(true);
                } else {
                    console.log("AdminGuard: Not admin, redirecting.");
                    router.push('/');
                }
            } catch (error) {
                console.error("AdminGuard Error:", error);
                router.push('/');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        checkAdmin();

        return () => { mounted = false; };
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-800" />
            </div>
        );
    }

    if (!authorized) {
        return null; // Will redirect
    }

    return <>{children}</>;
}
