"use client";

import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";
import { MobileTabBar } from "./MobileTabBar";
import { LogoMark } from "./Logo";

const BARE_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

function Footer() {
    return (
        <footer className="mt-20 mb-16 md:mb-0 border-line border-t">
            <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-6 mx-auto px-4 sm:px-6 lg:px-10 py-10 max-w-[1600px]">
                <div className="flex items-center gap-3">
                    <LogoMark size={28} />
                    <div>
                        <p className="font-display font-semibold text-fg text-sm">MediaFlow</p>
                        <p className="text-fg-subtle text-xs">Every source, one place.</p>
                    </div>
                </div>
                <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-fg-muted text-sm">
                    <Link href="/browse?type=movie" className="hover:text-fg">Movies</Link>
                    <Link href="/browse?type=tv" className="hover:text-fg">Series</Link>
                    <Link href="/anime" className="hover:text-fg">Anime</Link>
                    <Link href="/sources" className="hover:text-fg">Sources</Link>
                    <Link href="/genre" className="hover:text-fg">Genres</Link>
                    <Link href="/settings" className="hover:text-fg">Settings</Link>
                </nav>
                <p className="max-w-sm text-fg-subtle text-xs leading-relaxed">
                    Metadata by TMDB. Availability by JustWatch. This product uses the TMDB API but is not endorsed or certified by TMDB.
                </p>
            </div>
        </footer>
    );
}

/** Chrome around every page: fixed top nav, footer and mobile tab bar (hidden on auth screens). */
export function AppShell({ children }: { children: ReactNode }) {
    const pathname = usePathname() || "/";

    if (BARE_ROUTES.includes(pathname)) return <>{children}</>;

    return (
        <>
            <Suspense fallback={<div className="top-0 z-50 fixed inset-x-0 h-16" />}>
                <TopNav />
            </Suspense>
            <main className="pt-16 min-h-[70vh]">{children}</main>
            <Footer />
            <MobileTabBar />
        </>
    );
}
