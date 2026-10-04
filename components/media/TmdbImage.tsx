import Image from "next/image";
import { tmdbImage, type TmdbSize } from "@/lib/media";
import { cx } from "@/components/ui/primitives";
import type { ReactNode } from "react";

interface TmdbImageProps {
    path: string | null | undefined;
    alt: string;
    size?: TmdbSize;
    className?: string;
    priority?: boolean;
    /** Rendered when the title has no artwork. */
    fallback?: ReactNode;
}

/**
 * Fills its (relatively positioned) parent with a TMDB image.
 * TMDB already serves pre-sized images, so Next's optimizer is skipped.
 */
export function TmdbImage({ path, alt, size = "w500", className, priority, fallback }: TmdbImageProps) {
    const src = tmdbImage(path, size);

    if (!src) {
        return (
            <div className="absolute inset-0 flex justify-center items-center bg-linear-to-br from-surface-raised to-surface-dark p-3 text-center">
                {fallback ?? <span className="font-display font-semibold text-fg-subtle text-sm line-clamp-3">{alt}</span>}
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            unoptimized
            priority={priority}
            draggable={false}
            className={cx("object-cover", className)}
        />
    );
}
