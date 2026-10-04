"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Layers, Library, UserRound } from "lucide-react";
import { cx } from "@/components/ui/primitives";

const TABS = [
    { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
    { href: "/browse?type=movie", label: "Browse", icon: Compass, match: (p: string) => p.startsWith("/browse") || p.startsWith("/genre") || p.startsWith("/anime") },
    { href: "/sources", label: "Sources", icon: Layers, match: (p: string) => p.startsWith("/sources") },
    { href: "/watchlist", label: "Library", icon: Library, match: (p: string) => ["/watchlist", "/favorites", "/recent"].includes(p) },
    { href: "/settings", label: "Profile", icon: UserRound, match: (p: string) => p.startsWith("/settings") },
];

/** Bottom navigation for small screens. */
export function MobileTabBar() {
    const pathname = usePathname() || "/";

    return (
        <nav aria-label="Primary" className="md:hidden bottom-0 z-50 fixed inset-x-0 glass pb-[env(safe-area-inset-bottom)] border-line border-t">
            <ul className="grid grid-cols-5 h-16">
                {TABS.map(({ href, label, icon: Icon, match }) => {
                    const active = match(pathname);
                    return (
                        <li key={href}>
                            <Link
                                href={href}
                                aria-current={active ? "page" : undefined}
                                className={cx(
                                    "flex flex-col justify-center items-center gap-1 h-full font-medium text-[10px] transition-colors",
                                    active ? "text-primary-light" : "text-fg-subtle hover:text-fg",
                                )}
                            >
                                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
