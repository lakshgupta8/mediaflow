"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";
import type { RootState } from "@/store/store";
import { Logo } from "./Logo";
import { SearchCommand } from "./SearchCommand";
import { UserMenu } from "./UserMenu";
import { RegionPicker } from "@/components/providers/RegionPicker";
import { ButtonLink, cx } from "@/components/ui/primitives";

const NAV = [
    { href: "/", label: "Home", match: (p: string) => p === "/" },
    { href: "/browse?type=movie", label: "Movies", match: (p: string, t: string | null) => p === "/browse" && t !== "tv" },
    { href: "/browse?type=tv", label: "Series", match: (p: string, t: string | null) => p === "/browse" && t === "tv" },
    { href: "/anime", label: "Anime", match: (p: string) => p.startsWith("/anime") },
    { href: "/sources", label: "Sources", match: (p: string) => p.startsWith("/sources") },
    { href: "/genre", label: "Genres", match: (p: string) => p.startsWith("/genre") },
];

export function TopNav() {
    const pathname = usePathname() || "/";
    const params = useSearchParams();
    const { user, isLoading } = useSelector((state: RootState) => state.auth);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ⌘K / Ctrl+K anywhere, or "/" when not typing, opens search.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <>
            <header
                className={cx(
                    "top-0 z-50 fixed inset-x-0 transition-[background-color,border-color,backdrop-filter] duration-300",
                    scrolled ? "glass border-b border-line" : "border-b border-transparent bg-linear-to-b from-black/70 to-transparent",
                )}
            >
                <div className="flex items-center gap-4 lg:gap-8 mx-auto px-4 sm:px-6 lg:px-10 max-w-[1600px] h-16">
                    <Logo />

                    <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
                        {NAV.map((item) => {
                            const active = item.match(pathname, params.get("type"));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={cx(
                                        "relative px-3 py-2 rounded-lg font-medium text-sm transition-colors",
                                        active ? "text-fg" : "text-fg-muted hover:text-fg",
                                    )}
                                >
                                    {item.label}
                                    {active && <span className="right-3 -bottom-0.5 left-3 absolute bg-primary rounded-full h-0.5" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex flex-1 justify-end items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            aria-label="Search"
                            className="group flex items-center gap-2.5 bg-white/6 hover:bg-white/10 lg:px-3.5 border border-line rounded-xl lg:w-64 size-10 lg:h-10 text-fg-muted hover:text-fg transition-colors justify-center lg:justify-start"
                        >
                            <Search size={17} />
                            <span className="hidden lg:inline flex-1 text-sm text-left">Search titles…</span>
                            <kbd className="hidden lg:inline px-1.5 py-0.5 border border-line rounded font-sans text-[10px] text-fg-subtle">⌘K</kbd>
                        </button>

                        <RegionPicker variant="compact" className="hidden sm:block" />

                        {isLoading ? (
                            <span className="rounded-full size-9 skeleton" />
                        ) : user ? (
                            <UserMenu />
                        ) : (
                            <ButtonLink href="/login" size="sm" className="h-10">
                                Sign in
                            </ButtonLink>
                        )}
                    </div>
                </div>
            </header>

            <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
