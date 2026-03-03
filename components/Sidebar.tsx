"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Search, Bookmark, Film, History, Heart, Settings } from "lucide-react";
import { Tooltip } from "./Tooltip";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export function Sidebar() {
    const pathname = usePathname();
    const user = useSelector((state: RootState) => state.auth.user);

    if (pathname === '/login' || pathname === '/signup') return null;

    const mainNav = [
        { name: "Home", href: "/", icon: Home },
        { name: "Search", href: "/search", icon: Search },
        { name: "Watchlist", href: "/watchlist", icon: Bookmark },
        { name: "Genre Spotlight", href: "/genre", icon: Film },
    ];

    const libraryNav = [
        { name: "Recent", href: "/recent", icon: History },
        { name: "Favorites", href: "/favorites", icon: Heart },
    ];

    return (
        <aside className="hidden z-20 md:flex flex-col justify-between bg-surface-dark border-white/5 border-r w-20 h-full shrink-0">
            <div className="flex flex-col items-center gap-6 p-6 px-4 pt-12">
                <div
                    className="bg-cover bg-no-repeat bg-center shadow-[0_0_15px_rgba(19,236,91,0.3)] mb-4 rounded-full size-10 shrink-0"
                    style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDw9sLfhQeLIi93MprdKME_NU8yvJi0Nbzs9f9hxul-Fe4JyYiV6D9wK-KXzPCTNXq9msNG_GXAE-yVXv6aamsI5uSrq2W8U14MJyJl6DCipdlMxaHr1oFQHT8pK71MHPhUvfEcvL-F-0hoGUcKHcvitcbhdTC3N-re5QDf4zHiGvzWQJFO5PV8DzORYPGc5O2honslenYL1HyzILWSrSVWZK-9bvglPriYlBBmoTaYCG8wuGW2md7Pvy-J22PNR5Hfl5_6cIbu5A")',
                    }}
                ></div>

                <nav className="relative flex flex-col gap-2 w-full">
                    {mainNav.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Tooltip key={item.name} content={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex justify-center items-center gap-4 px-0 py-3 w-full rounded-xl transition-all relative z-10 ${isActive ? "text-primary" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active-pill"
                                            className="-z-10 absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className="transition-transform shrink-0" />
                                </Link>
                            </Tooltip>
                        );
                    })}
                </nav>

                <div className="bg-linear-to-r from-transparent via-white/10 to-transparent my-2 w-full h-px"></div>

                <div className="relative flex flex-col gap-2 w-full">
                    {libraryNav.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Tooltip key={item.name} content={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex justify-center items-center gap-4 px-0 py-3 w-full rounded-xl transition-all relative z-10 ${isActive ? "text-primary" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active-pill"
                                            className="-z-10 absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className="transition-transform shrink-0" />
                                </Link>
                            </Tooltip>
                        );
                    })}
                </div>
            </div>

            <div className="relative flex flex-col items-center gap-4 p-6 px-4">
                <Tooltip content="Settings">
                    <Link
                        href="/settings"
                        className={`flex justify-center items-center gap-4 px-0 py-3 w-full rounded-xl transition-all relative z-10 ${pathname?.startsWith("/settings") ? "text-primary" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                    >
                        {pathname?.startsWith("/settings") && (
                            <motion.div
                                layoutId="sidebar-active-pill"
                                className="-z-10 absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <Settings className="transition-transform shrink-0" />
                    </Link>
                </Tooltip>
                <div className="group/profile relative w-full">
                    <Tooltip content={user?.name ? `Logout ${user.name}` : "Logout"}>
                        <button
                            onClick={async () => {
                                const { createClient } = await import('@/utils/supabase/client');
                                const supabase = createClient();
                                await supabase.auth.signOut();
                                // AuthProvider handles Redux logout and redirect if needed automatically via onAuthStateChange
                            }}
                            className="flex justify-center items-center gap-3 bg-white/5 hover:bg-red-500/10 px-0 py-2 border border-white/5 hover:border-red-500/30 rounded-xl w-full h-12 transition-colors cursor-pointer"
                        >
                            <div className="flex justify-center items-center bg-primary/10 group-hover/profile:bg-red-500/20 rounded-full w-8 md:w-10 h-8 md:h-10 text-primary group-hover/profile:text-red-500 transition-all shrink-0">
                                <span className="group-hover/profile:hidden font-bold text-sm md:text-base uppercase">
                                    {user?.name?.charAt(0) || "U"}
                                </span>
                                <span className="hidden group-hover/profile:block">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                </span>
                            </div>
                        </button>
                    </Tooltip>
                </div>
            </div>
        </aside>
    );
}
