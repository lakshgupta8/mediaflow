"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createClient } from "@/utils/supabase/client";
import { login, logout } from "@/store/features/authSlice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const supabase = createClient();

    useEffect(() => {
        // Fetch current session on mount
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                dispatch(login({
                    id: session.user.id,
                    name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || "User",
                    email: session.user.email!,
                }));
            } else {
                dispatch(logout());
            }
        };

        getSession();

        // Listen for auth changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.user) {
                    dispatch(login({
                        id: session.user.id,
                        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || "User",
                        email: session.user.email!,
                    }));
                } else {
                    dispatch(logout());
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [dispatch, supabase]);

    return <>{children}</>;
}
