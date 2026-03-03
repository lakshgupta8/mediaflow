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
                <Tooltip content={user?.name || "Profile"}>
                    <Link
                        href="/settings"
                        className="flex justify-center items-center bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl w-full h-12 transition-colors"
                    >
                        <div className="flex justify-center items-center bg-primary/10 rounded-full w-8 md:w-10 h-8 md:h-10 text-primary shrink-0">
                            <span className="font-bold text-sm md:text-base uppercase">
                                {user?.name?.charAt(0) || "U"}
                            </span>
                        </div>
                    </Link>
                </Tooltip>
            </div>
        </aside>
    );
}
