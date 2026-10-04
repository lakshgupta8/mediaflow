import Link from "next/link";
import { cx } from "@/components/ui/primitives";

/**
 * Brand mark: the MediaFlow film glyph in a neon-green circle.
 * The same drawing is used for the favicon (app/icon.svg).
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className={cx("shrink-0", className)}>
            <circle cx="32" cy="32" r="32" fill="#13ec5b" />
            <g
                transform="translate(12.8 12.8) scale(1.6)"
                fill="none"
                stroke="#050a06"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 3v18M3 7.5h4M3 12h18M3 16.5h4M17 3v18M17 7.5h4M17 16.5h4" />
            </g>
        </svg>
    );
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
    return (
        <Link href="/" aria-label="MediaFlow home" className={cx("group/logo flex items-center gap-2.5 shrink-0", className)}>
            <LogoMark className="drop-shadow-[0_0_12px_rgb(19_236_91/0.35)] group-hover/logo:scale-105 transition-transform" />
            {!compact && (
                <span className="font-display font-bold text-fg text-lg tracking-tight">
                    Media<span className="text-primary">Flow</span>
                </span>
            )}
        </Link>
    );
}
