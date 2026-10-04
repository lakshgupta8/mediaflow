"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authService } from "@/services/authService";
import { pingAppwriteOnce } from "@/lib/appwrite";
import { login, logout } from "@/store/features/authSlice";

/**
 * Restores the Appwrite session on first load and mirrors it into Redux.
 * Login, signup and logout dispatch their own updates, so no listener is needed.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        pingAppwriteOnce();

        let cancelled = false;

        authService.getCurrentUser().then((user) => {
            if (cancelled) return;
            dispatch(user ? login(user) : logout());
        });

        return () => {
            cancelled = true;
        };
    }, [dispatch]);

    return <>{children}</>;
}
