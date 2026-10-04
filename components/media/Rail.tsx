"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx, SectionHeader } from "@/components/ui/primitives";
import type { MediaItem } from "@/services/tmdbService";
import { MediaCard, MediaCardSkeleton } from "./MediaCard";

interface RailProps {
    title: ReactNode;
    subtitle?: ReactNode;
    eyebrow?: ReactNode;
    seeAllHref?: string;
    children: ReactNode;
    /** Extra classes for the scroll track (gap, padding). */
    trackClassName?: string;
}

/** Horizontally scrolling row with snap points and desktop arrow controls. */
export function Rail({ title, subtitle, eyebrow, seeAllHref, children, trackClassName }: RailProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const update = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanPrev(el.scrollLeft > 8);
        setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    }, []);

    useEffect(() => {
        update();
        const el = trackRef.current;
        if (!el) return;
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, [update, children]);

    const scroll = (direction: 1 | -1) => {
        const el = trackRef.current;
        if (!el) return;
        el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
    };

    return (
        <section className="group/rail relative">
            <SectionHeader
                title={title}
                subtitle={subtitle}
                eyebrow={eyebrow}
                action={
                    <div className="flex items-center gap-1">
                        {seeAllHref && (
                            <Link href={seeAllHref} className="mr-1 font-semibold text-fg-muted hover:text-primary-light text-sm transition-colors">
                                See all
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={() => scroll(-1)}
                            disabled={!canPrev}
                            aria-label="Scroll left"
                            className="hidden md:flex justify-center items-center hover:bg-white/8 disabled:opacity-25 border border-line rounded-lg size-8 text-fg-muted hover:text-fg transition"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => scroll(1)}
                            disabled={!canNext}
                            aria-label="Scroll right"
                            className="hidden md:flex justify-center items-center hover:bg-white/8 disabled:opacity-25 border border-line rounded-lg size-8 text-fg-muted hover:text-fg transition"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                }
            />
            <div
                ref={trackRef}
                onScroll={update}
                className={cx(
                    "flex gap-3 sm:gap-4 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 pt-1 pb-3 overflow-x-auto overscroll-x-contain snap-mandatory snap-x scroll-px-4 sm:scroll-px-6 lg:scroll-px-10 no-scrollbar",
                    trackClassName,
                )}
            >
                {children}
            </div>
        </section>
    );
}

/** Standard poster width inside rails. */
export const railItemClass = "w-[138px] sm:w-[156px] lg:w-[176px] shrink-0 snap-start";

interface MediaRailProps extends Omit<RailProps, "children"> {
    items: MediaItem[] | undefined;
    isLoading?: boolean;
    ranked?: boolean;
    emptyText?: string;
}

export function MediaRail({ items, isLoading, ranked, emptyText, ...rail }: MediaRailProps) {
    if (!isLoading && items && items.length === 0) {
        if (!emptyText) return null;
        return (
            <Rail {...rail}>
                <p className="py-10 text-fg-subtle text-sm">{emptyText}</p>
            </Rail>
        );
    }

    return (
        <Rail {...rail}>
            {isLoading || !items
                ? Array.from({ length: 8 }).map((_, i) => <MediaCardSkeleton key={i} className={railItemClass} />)
                : items.map((item, i) => (
                    <MediaCard
                        key={`${item.media_type}-${item.id}`}
                        item={item}
                        rank={ranked ? i + 1 : undefined}
                        className={cx(railItemClass, ranked && (i >= 9 ? "w-[202px] sm:w-[220px] lg:w-[240px]" : "w-[178px] sm:w-[196px] lg:w-[216px]"))}
                    />
                ))}
        </Rail>
    );
}
