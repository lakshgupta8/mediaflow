"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Lock, LogIn } from "lucide-react";
import { ButtonLink, Skeleton } from "@/components/ui/primitives";

interface AuthGuardProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export function AuthGuard({ children, title, description }: AuthGuardProps) {
    const { user, isLoading } = useSelector((state: RootState) => state.auth);

    // Skeleton while the session is being restored, so logged-in users never see the lock screen flash.
    if (isLoading) {
        return (
            <div
                role="status"
                aria-label="Checking your session"
                className="flex flex-col flex-1 justify-center items-center px-6 py-20 min-h-[40vh]"
            >
                <Skeleton className="mb-6 rounded-2xl size-16" />
                <Skeleton className="mb-3 rounded-lg w-56 h-7" />
                <Skeleton className="mb-8 rounded-lg w-72 max-w-full h-4" />
                <Skeleton className="w-44 h-11" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center px-6 py-20 min-h-[40vh] text-center animate-fade-in">
                <div className="relative mb-6">
                    <div aria-hidden className="absolute inset-0 bg-primary/25 blur-2xl rounded-full" />
                    <div className="relative flex justify-center items-center bg-surface-raised border border-line-strong rounded-2xl size-16 text-primary-light">
                        <Lock size={26} />
                    </div>
                </div>
                <h2 className="font-display font-bold text-fg text-2xl sm:text-3xl tracking-tight">{title}</h2>
                <p className="mt-3 max-w-md text-fg-muted text-sm sm:text-base leading-relaxed">{description}</p>
                <div className="flex sm:flex-row flex-col items-center gap-3 mt-8">
                    <ButtonLink href="/login" size="lg">
                        <LogIn size={18} /> Log in to continue
                    </ButtonLink>
                    <ButtonLink href="/signup" variant="ghost" size="lg">
                        Create an account
                    </ButtonLink>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
