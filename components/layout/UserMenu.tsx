"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Clock, Heart, LayoutGrid, LogOut, Settings } from "lucide-react";
import type { RootState } from "@/store/store";
import { logout } from "@/store/features/authSlice";
import { authService } from "@/services/authService";
import { userDataService } from "@/services/userDataService";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cx } from "@/components/ui/primitives";

export function useProfileAvatar() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { data: profile } = useQuery({
        queryKey: ["userProfile", user?.id],
        queryFn: () => userDataService.getUserProfile(user!.id),
        enabled: !!user,
    });
    return { user, avatarUrl: profile?.avatar_url ?? null, name: profile?.full_name || user?.name || "" };
}

export function Avatar({ url, name, size = 36, className }: { url: string | null; name: string; size?: number; className?: string }) {
    return (
        <span
            className={cx("inline-flex justify-center items-center bg-linear-to-br from-primary to-primary-strong bg-cover bg-center rounded-full font-display font-bold text-primary-ink uppercase shrink-0", className)}
            style={{ width: size, height: size, fontSize: size * 0.4, ...(url ? { backgroundImage: `url('${url}')` } : {}) }}
            aria-hidden
        >
            {!url && (name.charAt(0) || "U")}
        </span>
    );
}

const LINKS = [
    { href: "/watchlist", label: "Watchlist", icon: Bookmark },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/recent", label: "Watch history", icon: Clock },
    { href: "/settings?tab=sources", label: "My services", icon: LayoutGrid },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function UserMenu() {
    const router = useRouter();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { user, avatarUrl, name } = useProfileAvatar();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, () => setOpen(false), open);

    if (!user) return null;

    const handleLogout = async () => {
        setOpen(false);
        await authService.signOut();
        dispatch(logout());
        queryClient.clear();
        router.push("/login");
    };

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Account menu"
                className="flex items-center rounded-full ring-2 ring-transparent hover:ring-primary/40 transition"
            >
                <Avatar url={avatarUrl} name={name} />
            </button>

            {open && (
                <div role="menu" className="right-0 z-60 absolute bg-surface-dark shadow-2xl shadow-black/60 mt-2 border border-line-strong rounded-2xl w-64 overflow-hidden animate-fade-in">
                    <div className="flex items-center gap-3 px-4 py-4 border-line border-b">
                        <Avatar url={avatarUrl} name={name} size={40} />
                        <div className="min-w-0">
                            <p className="font-semibold text-fg text-sm truncate">{name}</p>
                            <p className="text-fg-subtle text-xs truncate">{user.email}</p>
                        </div>
                    </div>
                    <div className="p-1.5">
                        {LINKS.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                role="menuitem"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 hover:bg-white/6 px-3 py-2.5 rounded-xl text-fg-muted hover:text-fg text-sm transition-colors"
                            >
                                <Icon size={16} /> {label}
                            </Link>
                        ))}
                    </div>
                    <div className="p-1.5 border-line border-t">
                        <button
                            type="button"
                            role="menuitem"
                            onClick={handleLogout}
                            className="flex items-center gap-3 hover:bg-danger/10 px-3 py-2.5 rounded-xl w-full text-danger text-sm transition-colors"
                        >
                            <LogOut size={16} /> Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
