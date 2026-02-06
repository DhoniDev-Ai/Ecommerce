"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    userRole: string | null;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Check active session immediately
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    const { data } = await supabase.from('users').select('role').eq('id', session.user.id).single();
                    setUserRole(data?.role || null);
                }
            } catch (error) {
                console.error("Auth Init Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // 2. Listen for auth changes (Login, Logout, Token Refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false); // Ensure loading is done

            if (session?.user) {
                // Only fetch role if it changed or we don't have it
                if (!userRole) {
                    const { data } = await supabase.from('users').select('role').eq('id', session.user.id).single();
                    setUserRole(data?.role || null);
                }
            } else {
                setUserRole(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, session, isLoading, userRole, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
