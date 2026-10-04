import type { ReactNode } from "react";
import type { MediaItem } from "@/services/tmdbService";
import { MediaCard, MediaCardSkeleton } from "./MediaCard";
import { cx } from "@/components/ui/primitives";

export const gridClass = "grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-6";

interface MediaGridProps {
    items: MediaItem[] | undefined;
    isLoading?: boolean;
    skeletonCount?: number;
    empty?: ReactNode;
    className?: string;
}

export function MediaGrid({ items, isLoading, skeletonCount = 14, empty, className }: MediaGridProps) {
    if (isLoading) {
        return (
            <div className={cx(gridClass, className)}>
                {Array.from({ length: skeletonCount }).map((_, i) => <MediaCardSkeleton key={i} />)}
            </div>
        );
    }

    if (!items || items.length === 0) return <>{empty ?? null}</>;

    return (
        <div className={cx(gridClass, className)}>
            {items.map((item) => <MediaCard key={`${item.media_type}-${item.id}`} item={item} />)}
        </div>
    );
}
