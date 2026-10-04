"use client";

import { useState } from "react";
import { CalendarClock, Star } from "lucide-react";
import type { Episode, SeasonDetails } from "@/services/tmdbService";
import { formatRuntime } from "@/lib/media";
import { TmdbImage } from "@/components/media/TmdbImage";
import { Chip, cx, Skeleton } from "@/components/ui/primitives";
import { formatDate } from "./DetailSections";

export interface SeasonSummary {
    season_number: number;
    name: string;
    episode_count: number;
}

export const isUpcoming = (ep: Episode) => !!ep.air_date && new Date(ep.air_date) > new Date();

export function SeasonChips({ seasons, active, onSelect }: { seasons: SeasonSummary[]; active: number; onSelect: (n: number) => void }) {
    return (
        <div role="tablist" aria-label="Seasons" className="flex gap-2 -mx-1 px-1 pb-1 overflow-x-auto no-scrollbar">
            {seasons.map((s) => (
                <Chip key={s.season_number} role="tab" aria-selected={active === s.season_number} active={active === s.season_number} onClick={() => onSelect(s.season_number)}>
                    {s.season_number === 0 ? "Specials" : `Season ${s.season_number}`}
                    <span className={cx("text-xs", active === s.season_number ? "opacity-60" : "text-fg-subtle")}>{s.episode_count}</span>
                </Chip>
            ))}
        </div>
    );
}

interface EpisodeListProps {
    season: SeasonDetails | undefined;
    isLoading: boolean;
    fallbackStill?: string | null;
}

export function EpisodeList({ season, isLoading, fallbackStill }: EpisodeListProps) {
    const [showAll, setShowAll] = useState(false);

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="rounded-xl w-40 sm:w-56 aspect-video shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                            <Skeleton className="w-1/2 h-4" />
                            <Skeleton className="w-1/3 h-3" />
                            <Skeleton className="w-full h-3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const episodes = season?.episodes || [];
    if (!episodes.length) return <p className="py-8 text-fg-subtle text-sm text-center">No episodes listed for this season yet.</p>;

    const visible = showAll ? episodes : episodes.slice(0, 6);

    return (
        <div>
            <ol className="space-y-2 sm:space-y-3">
                {visible.map((ep) => {
                    const upcoming = isUpcoming(ep);
                    return (
                        <li key={ep.id}>
                            <div className={cx("flex gap-3 sm:gap-4 p-2 rounded-2xl", upcoming && "opacity-60")}>
                                <div className="relative bg-surface-raised rounded-xl w-36 sm:w-56 aspect-video overflow-hidden shrink-0">
                                    <TmdbImage path={ep.still_path || fallbackStill} size="w300" alt="" />
                                    {ep.runtime ? (
                                        <span className="right-1.5 bottom-1.5 absolute bg-black/75 px-1.5 py-0.5 rounded font-medium text-[10px] text-white">
                                            {formatRuntime(ep.runtime)}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="flex-1 py-0.5 min-w-0">
                                    <p className="font-semibold text-fg text-sm truncate">
                                        <span className="mr-1.5 text-fg-subtle tabular-nums">{ep.episode_number}.</span>
                                        {ep.name}
                                    </p>
                                    <p className="flex items-center gap-2 mt-1 text-fg-subtle text-xs">
                                        {upcoming ? (
                                            <span className="flex items-center gap-1 text-warning"><CalendarClock size={12} /> Airs {formatDate(ep.air_date)}</span>
                                        ) : (
                                            formatDate(ep.air_date)
                                        )}
                                        {ep.vote_average > 0 && (
                                            <span className="flex items-center gap-1"><Star size={11} className="fill-warning text-warning" /> {ep.vote_average.toFixed(1)}</span>
                                        )}
                                    </p>
                                    {ep.overview && (
                                        <p className="hidden sm:block mt-2 text-fg-muted text-sm line-clamp-2 leading-relaxed">{ep.overview}</p>
                                    )}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>
            {episodes.length > 6 && (
                <button
                    type="button"
                    onClick={() => setShowAll((s) => !s)}
                    className="mt-3 py-3 border border-line hover:border-line-strong rounded-xl w-full font-semibold text-fg-muted hover:text-fg text-sm transition-colors"
                >
                    {showAll ? "Show fewer episodes" : `Show all ${episodes.length} episodes`}
                </button>
            )}
        </div>
    );
}
