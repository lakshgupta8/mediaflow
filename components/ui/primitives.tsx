import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ComponentProps, type ReactNode } from "react";

/* ---------------------------------------------------------------------------
 * Small shared building blocks. Everything visual in the app composes these,
 * so spacing, radii and states stay consistent across screens.
 * ------------------------------------------------------------------------- */

export const cx = (...classes: Array<string | number | false | null | undefined>) => classes.filter(Boolean).join(" ");

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon" | "icon-sm";

const variantClass: Record<Variant, string> = {
    primary: "bg-primary text-primary-ink hover:bg-primary-light shadow-[0_8px_30px_-8px_rgb(19_236_91/0.55)]",
    secondary: "bg-white/10 text-fg hover:bg-white/16 backdrop-blur-md",
    ghost: "text-fg-muted hover:text-fg hover:bg-white/6",
    outline: "border border-line-strong text-fg hover:bg-white/6 hover:border-white/25",
    danger: "bg-danger/12 text-danger hover:bg-danger/20 border border-danger/25",
};

const sizeClass: Record<Size, string> = {
    sm: "h-9 px-3.5 text-sm gap-1.5 rounded-lg",
    md: "h-11 px-5 text-sm gap-2 rounded-xl",
    lg: "h-13 px-7 text-base gap-2.5 rounded-xl",
    icon: "size-11 rounded-xl",
    "icon-sm": "size-9 rounded-lg",
};

export const buttonClass = (variant: Variant = "primary", size: Size = "md", extra?: string) =>
    cx(
        "inline-flex items-center justify-center font-semibold whitespace-nowrap select-none",
        "transition-[background-color,color,border-color,transform,box-shadow] duration-200 active:scale-[0.97]",
        "disabled:opacity-50 disabled:pointer-events-none",
        variantClass[variant],
        sizeClass[size],
        extra,
    );

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant = "primary", size = "md", className, type = "button", ...props },
    ref,
) {
    return <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props} />;
});

interface ButtonLinkProps extends ComponentProps<typeof Link> {
    variant?: Variant;
    size?: Size;
}

export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ButtonLinkProps) {
    return <Link className={buttonClass(variant, size, className)} {...props} />;
}

/** Page-width wrapper with the app's standard gutters. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
    return <div className={cx("mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10", className)}>{children}</div>;
}

export function Skeleton({ className }: { className?: string }) {
    return <div aria-hidden className={cx("skeleton rounded-xl", className)} />;
}

export function SectionHeader({
    title,
    subtitle,
    action,
    eyebrow,
}: {
    title: ReactNode;
    subtitle?: ReactNode;
    action?: ReactNode;
    eyebrow?: ReactNode;
}) {
    return (
        <div className="flex items-end justify-between gap-4 mb-4">
            <div className="min-w-0">
                {eyebrow && <div className="mb-1 font-semibold text-[11px] text-primary uppercase tracking-[0.14em]">{eyebrow}</div>}
                <h2 className="font-display font-bold text-fg text-xl sm:text-2xl truncate">{title}</h2>
                {subtitle && <p className="mt-0.5 text-fg-muted text-sm">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

export function Chip({
    active,
    children,
    className,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
    return (
        <button
            type="button"
            aria-pressed={active}
            className={cx(
                "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                active
                    ? "bg-fg text-background-dark"
                    : "bg-white/6 text-fg-muted hover:bg-white/10 hover:text-fg border border-line",
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "accent" | "success" | "warning"; className?: string }) {
    const tones = {
        neutral: "bg-white/8 text-fg-muted border-line",
        accent: "bg-primary/15 text-primary-light border-primary/25",
        success: "bg-success/12 text-success border-success/25",
        warning: "bg-warning/12 text-warning border-warning/25",
    };
    return (
        <span className={cx("inline-flex items-center gap-1 px-2 py-0.5 border rounded-md font-semibold text-[11px] uppercase tracking-wide", tones[tone], className)}>
            {children}
        </span>
    );
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: {
    icon: ReactNode;
    title: string;
    description?: ReactNode;
    action?: ReactNode;
    className?: string;
}) {
    return (
        <div className={cx("flex flex-col items-center justify-center text-center py-20 px-6", className)}>
            <div className="flex justify-center items-center bg-white/5 mb-5 border border-line rounded-2xl size-16 text-fg-muted">
                {icon}
            </div>
            <h3 className="font-display font-semibold text-fg text-xl">{title}</h3>
            {description && <p className="mt-2 max-w-md text-fg-muted text-sm leading-relaxed">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

export function PageHeader({
    eyebrow,
    title,
    description,
    actions,
    icon,
}: {
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    icon?: ReactNode;
}) {
    return (
        <header className="flex md:flex-row flex-col md:justify-between md:items-end gap-5 pt-8 pb-6">
            <div className="flex items-start gap-4 min-w-0">
                {icon && (
                    <div className="flex justify-center items-center bg-primary/12 border border-primary/20 rounded-2xl size-12 text-primary-light shrink-0">
                        {icon}
                    </div>
                )}
                <div className="min-w-0">
                    {eyebrow && <div className="mb-1.5 font-semibold text-[11px] text-primary uppercase tracking-[0.14em]">{eyebrow}</div>}
                    <h1 className="font-display font-bold text-fg text-3xl sm:text-4xl tracking-tight">{title}</h1>
                    {description && <p className="mt-2 max-w-2xl text-fg-muted text-base">{description}</p>}
                </div>
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
    );
}
