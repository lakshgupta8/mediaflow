import Image from "next/image";
import { tmdbImage } from "@/lib/media";
import { cx } from "@/components/ui/primitives";

interface ProviderLogoProps {
    name: string;
    logoPath: string | null | undefined;
    size?: number;
    className?: string;
}

/** Square provider logo with a lettered fallback. */
export function ProviderLogo({ name, logoPath, size = 40, className }: ProviderLogoProps) {
    const src = tmdbImage(logoPath, size > 64 ? "w154" : "w92");

    return (
        <span
            className={cx("relative inline-flex justify-center items-center bg-surface-raised rounded-[22%] ring-1 ring-white/10 overflow-hidden shrink-0", className)}
            style={{ width: size, height: size }}
        >
            {src ? (
                <Image src={src} alt={name} fill unoptimized className="object-cover" sizes={`${size}px`} />
            ) : (
                <span className="font-display font-bold text-fg-muted" style={{ fontSize: size * 0.4 }}>
                    {name.charAt(0)}
                </span>
            )}
        </span>
    );
}
