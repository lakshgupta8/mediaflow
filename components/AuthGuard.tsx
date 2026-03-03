"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface AuthGuardProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export function AuthGuard({ children, title, description }: AuthGuardProps) {
    const user = useSelector((state: RootState) => state.auth.user);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Prevent hydration mismatch or flash
    if (!mounted) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center p-8 py-20 min-h-[40vh]">
                <div className="flex flex-col items-center animate-pulse">
                    <div className="bg-white/10 mb-6 rounded-full w-16 h-16"></div>
                    <div className="bg-white/10 mb-3 rounded-lg w-48 h-8"></div>
                    <div className="bg-white/10 mb-8 rounded-lg w-64 h-4"></div>
                    <div className="bg-white/10 rounded-xl w-40 h-12"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center p-8 py-20 min-h-[40vh]">
                <div className="bg-white/5 shadow-xl mb-6 p-6 border border-white/10 rounded-2xl">
                    <Lock size={48} className="text-slate-400" />
                </div>
                <h2 className="mb-3 font-bold text-white text-3xl text-center">{title}</h2>
                <p className="mb-8 max-w-md text-slate-400 text-center">{description}</p>
                <Link href="/login" className="bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(19,236,91,0.2)] px-8 py-3 rounded-xl font-bold text-background-dark hover:scale-105 active:scale-95 transition-all">
                    Log In to Continue
                </Link>
            </div>
        );
    }

    return <>{children}</>;
}
