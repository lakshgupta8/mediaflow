"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Search, Bookmark, Film, History, Heart, Settings } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

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
        <aside className="hidden z-20 md:flex flex-col justify-between bg-surface-dark border-white/5 border-r w-64 h-full shrink-0">
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <div
                        className="bg-cover bg-no-repeat bg-center shadow-[0_0_15px_rgba(19,236,91,0.3)] rounded-full size-10"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDw9sLfhQeLIi93MprdKME_NU8yvJi0Nbzs9f9hxul-Fe4JyYiV6D9wK-KXzPCTNXq9msNG_GXAE-yVXv6aamsI5uSrq2W8U14MJyJl6DCipdlMxaHr1oFQHT8pK71MHPhUvfEcvL-F-0hoGUcKHcvitcbhdTC3N-re5QDf4zHiGvzWQJFO5PV8DzORYPGc5O2honslenYL1HyzILWSrSVWZK-9bvglPriYlBBmoTaYCG8wuGW2md7Pvy-J22PNR5Hfl5_6cIbu5A")',
                        }}
                    ></div>
                    <h1 className="font-bold text-white text-xl tracking-wide">
                        Media<span className="text-primary">Flow</span>
                    </h1>
                </div>

                <nav className="relative flex flex-col gap-2">
                    {mainNav.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative z-10 ${isActive ? "text-primary" : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active-pill"
                                        className="-z-10 absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className="group-hover:scale-110 transition-transform" />
                                <p className="font-medium text-sm">{item.name}</p>
                            </Link>
                        );
                    })}
                </nav>

                <div className="bg-gradient-to-r from-transparent via-white/10 to-transparent my-2 w-full h-px"></div>

                <div className="relative flex flex-col gap-2">
                    <p className="px-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                        Library
                    </p>
                    {libraryNav.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative z-10 ${isActive ? "text-primary" : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active-pill"
                                        className="-z-10 absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className="group-hover:scale-110 transition-transform" />
                                <p className="font-medium text-sm">{item.name}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="relative flex flex-col gap-4 p-6">
                <Link
                    href="/settings"
                    className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative z-10 ${pathname?.startsWith("/settings") ? "text-primary" : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                >
                    {pathname?.startsWith("/settings") && (
                        <motion.div
                            layoutId="sidebar-active-pill"
                            className="-z-10 absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <Settings className="group-hover:rotate-45 transition-transform" />
                    <p className="font-medium text-sm">Settings</p>
                </Link>
                <div className="group flex items-center gap-3 bg-white/5 px-2 py-2 border border-white/5 hover:border-primary/30 rounded-xl transition-colors cursor-pointer">
                    <div
                        className="bg-cover bg-center rounded-full ring-2 ring-transparent group-hover:ring-primary/50 w-10 h-10 transition-all"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQuohTGr6p1ynAQrfWXMBQ6zMRlNccZBXrwgOyYTNQ2nW271Yx4y9Fx2bk4Qe_5OWQCSoAk2Yu2kDzUt1HVa6W2c35j1tZIRHVKbjq84Nfk2tiTTDz0rX7fbPKDdpnT84Dx4V4Iztn-XzGxnsCJ1XBAHl-K5942w0WA1TTHzRpyX-FmKYxebkuvXGyn6deR4pGfYeTLGwXJbXuSANgwPAF-gUDQbrK5oPMmJtqYqGQgjAWj0MLT3icHqwmZLJS7U32DuKxxACNdQ')",
                        }}
                    ></div>
                    <div className="flex flex-col">
                        <p className="font-semibold text-white text-sm">Neo Anderson</p>
                        <p className="text-primary text-xs">Premium Plan</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
