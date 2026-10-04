"use client";

import Link from "next/link";
import { forwardRef, useId, useMemo, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { TmdbImage } from "@/components/media/TmdbImage";
import { cx, Skeleton } from "@/components/ui/primitives";
import { tmdbService, type MediaItem } from "@/services/tmdbService";
import { mediaTitle } from "@/lib/media";

/* ---------------------------------------------------------------------------
 * Shared shell for the auth screens: form panel on the left, a slowly
 * drifting mosaic of trending posters on the right (lg+ only).
 * ------------------------------------------------------------------------- */

const COLUMN_COUNT = 4;
const POSTERS_PER_COLUMN = 6;

/** Per-column motion + offset so the wall never looks like a grid in lockstep. */
const COLUMN_STYLE = [
    { animation: "auth-drift-up 90s linear infinite", offset: "-mt-40" },
    { animation: "auth-drift-down 110s linear infinite", offset: "-mt-6" },
    { animation: "auth-drift-up 100s linear infinite", offset: "-mt-64" },
    { animation: "auth-drift-down 120s linear infinite", offset: "-mt-20" },
];

// The columns hold two copies of their posters, so translating by -50% loops seamlessly.
const DRIFT_CSS = `
@keyframes auth-drift-up { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(0, -50%, 0); } }
@keyframes auth-drift-down { from { transform: translate3d(0, -50%, 0); } to { transform: translate3d(0, 0, 0); } }
@media (prefers-reduced-motion: reduce) { .auth-drift { animation: none !important; } }
`;

function PosterColumn({ items, index, loading }: { items: MediaItem[]; index: number; loading: boolean }) {
    const style = COLUMN_STYLE[index % COLUMN_STYLE.length];
    const loop = loading ? [] : [...items, ...items];

    return (
        <div className={cx("flex-1 min-w-0", style.offset, index === 3 && "hidden xl:block")}>
            {loading ? (
                <div className="flex flex-col gap-4">
                    {Array.from({ length: POSTERS_PER_COLUMN }).map((_, i) => (
                        <Skeleton key={i} className="rounded-2xl w-full aspect-2/3" />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-4 will-change-transform auth-drift" style={{ animation: style.animation }}>
                    {loop.map((item, i) => (
                        <div
                            key={`${item.id}-${i}`}
                            className="relative bg-surface-raised shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)] rounded-2xl ring-1 ring-white/8 w-full aspect-2/3 overflow-hidden"
                        >
                            <TmdbImage path={item.poster_path} size="w342" alt={mediaTitle(item)} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function PosterMosaic() {
    const { data, isLoading } = useQuery({
        queryKey: ["trending", "all", "week"],
        queryFn: () => tmdbService.getTrending("all", "week"),
        staleTime: 1000 * 60 * 30,
    });

    const columns = useMemo(() => {
        const posters = (data?.results ?? []).filter((item) => item.poster_path);
        const cols: MediaItem[][] = Array.from({ length: COLUMN_COUNT }, () => []);
        posters.slice(0, COLUMN_COUNT * POSTERS_PER_COLUMN).forEach((item, i) => cols[i % COLUMN_COUNT].push(item));
        return cols;
    }, [data]);

    return (
        <div aria-hidden className="absolute inset-0 overflow-hidden">
            <style>{DRIFT_CSS}</style>
            <div className="absolute -inset-x-16 -inset-y-24 flex gap-4 opacity-80 -rotate-6 scale-110 origin-center">
                {columns.map((items, i) => (
                    <PosterColumn key={i} items={items} index={i} loading={isLoading} />
                ))}
            </div>
        </div>
    );
}

function VisualPanel() {
    return (
        <aside className="hidden lg:block top-0 sticky bg-surface-dark border-line border-l h-dvh overflow-hidden">
            <PosterMosaic />

            {/* Overlays: tint, blend into the form panel, and a deep floor for the copy. */}
            <div aria-hidden className="absolute inset-0 bg-background-dark/35" />
            <div aria-hidden className="absolute inset-y-0 left-0 w-40 bg-linear-to-r from-background-dark to-transparent" />
            <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-background-dark/90 to-transparent" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62%] bg-linear-to-t from-background-dark via-background-dark/85 to-transparent" />
            <div aria-hidden className="-bottom-40 -left-20 absolute bg-primary/20 blur-3xl rounded-full size-[28rem]" />
            <div aria-hidden className="-right-24 bottom-10 absolute bg-primary-strong/10 blur-3xl rounded-full size-80" />

            <div className="right-0 bottom-0 left-0 absolute p-12 xl:p-16">
                <div className="inline-flex items-center gap-2 bg-white/6 backdrop-blur-md mb-6 px-3 py-1.5 border border-line-strong rounded-full font-medium text-fg-muted text-xs">
                    <span className="bg-success rounded-full size-1.5" />
                    Stream · Rent · Buy, in your region
                </div>
                <h2 className="max-w-xl font-display font-bold text-fg text-5xl xl:text-6xl leading-[1.02] tracking-tight">
                    Every source,
                    <br />
                    <span className="text-gradient">one place.</span>
                </h2>
                <p className="mt-5 max-w-md text-fg-muted text-base xl:text-lg leading-relaxed">
                    Track what&apos;s streaming across Netflix, Prime Video, Hotstar and every other service you pay for, and know
                    exactly where to watch next.
                </p>
            </div>
        </aside>
    );
}

interface AuthLayoutProps {
    title: ReactNode;
    subtitle?: ReactNode;
    children: ReactNode;
    /** Small note under the form, e.g. a link to the sibling auth screen. */
    footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
    return (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] bg-background-dark min-h-dvh font-sans text-fg">
            <div className="relative flex flex-col px-5 sm:px-10 xl:px-16 py-6 sm:py-8 min-h-dvh overflow-hidden">
                <div aria-hidden className="-top-48 -left-40 absolute bg-primary/10 blur-3xl rounded-full size-[32rem] pointer-events-none" />

                <header className="relative">
                    <Logo />
                </header>

                <main className="relative flex flex-1 justify-center items-center py-10 sm:py-14">
                    <div className="w-full max-w-md animate-fade-in">
                        <div className="mb-8">
                            <h1 className="font-display font-bold text-fg text-3xl sm:text-4xl tracking-tight">{title}</h1>
                            {subtitle && <p className="mt-2.5 text-fg-muted text-base leading-relaxed">{subtitle}</p>}
                        </div>
                        {children}
                        {footer && <div className="mt-8 text-fg-muted text-sm text-center">{footer}</div>}
                    </div>
                </main>

                <p className="relative text-fg-subtle text-xs text-center lg:text-left leading-relaxed">
                    By continuing you agree to our{" "}
                    <a href="#" className="hover:text-fg underline decoration-line-strong hover:decoration-primary underline-offset-4 transition-colors">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="hover:text-fg underline decoration-line-strong hover:decoration-primary underline-offset-4 transition-colors">
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>

            <VisualPanel />
        </div>
    );
}

/* ---------------------------------------------------------------------------
 * Segmented "Log in | Sign up" switch.
 * ------------------------------------------------------------------------- */

export function AuthTabs({ active }: { active: "login" | "signup" }) {
    const tabs = [
        { key: "login", label: "Log in", href: "/login" },
        { key: "signup", label: "Sign up", href: "/signup" },
    ] as const;

    return (
        <nav aria-label="Authentication" className="grid grid-cols-2 bg-surface-dark mb-7 p-1 border border-line rounded-xl">
            {tabs.map((tab) => {
                const isActive = tab.key === active;
                return (
                    <Link
                        key={tab.key}
                        href={tab.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cx(
                            "flex justify-center items-center rounded-lg h-10 font-semibold text-sm transition-colors duration-200",
                            isActive
                                ? "bg-surface-hover text-fg shadow-[0_1px_0_0_rgb(255_255_255/0.06)_inset,0_4px_12px_-4px_rgb(0_0_0/0.6)] ring-1 ring-line-strong"
                                : "text-fg-muted hover:text-fg",
                        )}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}

/* ---------------------------------------------------------------------------
 * Form fields.
 * ------------------------------------------------------------------------- */

export function FormError({ children }: { children: ReactNode }) {
    return (
        <div role="alert" className="bg-danger/10 px-4 py-3 border border-danger/25 rounded-xl text-danger text-sm leading-relaxed">
            {children}
        </div>
    );
}

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    label: string;
    icon: LucideIcon;
    /** Validation message; puts the field into its error state. */
    error?: string;
    /** Non-blocking caution message (amber), shown instead of `error`. */
    warning?: string;
    /** Rendered at the right edge of the label row (e.g. a "Forgot password?" link). */
    labelAside?: ReactNode;
    /** Rendered inside the input on the right (e.g. a spinner or toggle). */
    trailing?: ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
    { label, icon: Icon, error, warning, labelAside, trailing, id, className, disabled, ...inputProps },
    ref,
) {
    const autoId = useId();
    const inputId = id ?? `field-${autoId}`;
    const message = warning ?? error;
    const messageId = message ? `${inputId}-message` : undefined;

    return (
        <div className={cx("flex flex-col gap-2", disabled && "opacity-50", className)}>
            <div className="flex justify-between items-center gap-3">
                <label htmlFor={inputId} className="font-medium text-fg-muted text-sm">
                    {label}
                </label>
                {labelAside}
            </div>
            <div className="group relative">
                <Icon
                    aria-hidden
                    size={18}
                    className={cx(
                        "top-1/2 left-4 absolute transition-colors -translate-y-1/2 pointer-events-none",
                        warning ? "text-warning" : error ? "text-danger" : "text-fg-subtle group-focus-within:text-primary",
                    )}
                />
                <input
                    ref={ref}
                    id={inputId}
                    disabled={disabled}
                    aria-invalid={error && !warning ? true : undefined}
                    aria-describedby={messageId}
                    className={cx(
                        "bg-surface-raised pl-11 border rounded-xl outline-none w-full h-12 text-fg placeholder:text-fg-subtle text-[15px]",
                        "transition-[border-color,box-shadow,background-color] duration-200 disabled:cursor-not-allowed",
                        "focus:ring-4 focus-visible:outline-none",
                        trailing ? "pr-12" : "pr-4",
                        warning
                            ? "border-warning/60 focus:ring-warning/10"
                            : error
                              ? "border-danger focus:ring-danger/10"
                              : "border-line hover:border-line-strong focus:border-primary/60 focus:ring-primary/10",
                    )}
                    {...inputProps}
                />
                {trailing && <div className="top-1/2 right-2 absolute flex items-center -translate-y-1/2">{trailing}</div>}
            </div>
            {message && (
                <p id={messageId} className={cx("font-medium text-xs", warning ? "text-warning" : "text-danger")}>
                    {message}
                </p>
            )}
        </div>
    );
});

type PasswordFieldProps = Omit<FieldProps, "type" | "trailing">;

/** Password input with a working show/hide toggle. */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(props, ref) {
    const [visible, setVisible] = useState(false);

    return (
        <Field
            ref={ref}
            {...props}
            type={visible ? "text" : "password"}
            trailing={
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    disabled={props.disabled}
                    aria-label={visible ? "Hide password" : "Show password"}
                    aria-pressed={visible}
                    className="flex justify-center items-center hover:bg-white/6 rounded-lg size-9 text-fg-subtle hover:text-fg transition-colors"
                >
                    {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
                </button>
            }
        />
    );
});
