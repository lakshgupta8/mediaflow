"use client";

import { useDispatch } from "react-redux";
import Link from "next/link";
import { ArrowUpRight, Globe2, MonitorPlay, Sparkles } from "lucide-react";
import type { MediaType, Monetization, RegionAvailability, WatchProvider } from "@/services/tmdbService";
import { useWatchProviders, usePreferences } from "@/hooks/useProviders";
import { setRegion } from "@/store/features/preferencesSlice";
import { regionName } from "@/lib/media";
import { ProviderLogo } from "./ProviderLogo";
import { RegionPicker } from "./RegionPicker";
import { Badge, cx, Skeleton } from "@/components/ui/primitives";

const GROUPS: { key: string; label: string; hint: string; types: Monetization[] }[] = [
    { key: "stream", label: "Stream", hint: "With a subscription", types: ["flatrate"] },
    { key: "free", label: "Free", hint: "Free or with ads", types: ["free", "ads"] },
    { key: "rent", label: "Rent", hint: "Pay per view", types: ["rent"] },
    { key: "buy", label: "Buy", hint: "Own it digitally", types: ["buy"] },
];

const uniqueProviders = (availability: RegionAvailability, types: Monetization[]) => {
    const seen = new Set<number>();
    const out: WatchProvider[] = [];
    types.forEach((type) =>
        (availability[type] || []).forEach((p) => {
            if (!seen.has(p.provider_id)) {
                seen.add(p.provider_id);
                out.push(p);
            }
        }),
    );
    return out.sort((a, b) => a.display_priority - b.display_priority);
};

/** Count of distinct providers offering a title in a region. */
export const countSources = (availability: RegionAvailability | null) =>
    availability ? uniqueProviders(availability, ["flatrate", "free", "ads", "rent", "buy"]).length : 0;

/** Same-region providers the user subscribes to that stream this title. */
export const myServicesStreaming = (availability: RegionAvailability | null, myProviders: number[]) =>
    availability ? uniqueProviders(availability, ["flatrate", "free", "ads"]).filter((p) => myProviders.includes(p.provider_id)) : [];

interface WhereToWatchProps {
    mediaType: MediaType;
    id: number;
    title: string;
}

export function WhereToWatch({ mediaType, id, title }: WhereToWatchProps) {
    const dispatch = useDispatch();
    const { myProviders } = usePreferences();
    const { availability, region, hydrated, isLoading, regionsAvailable } = useWatchProviders(mediaType, id);

    const groups = availability
        ? GROUPS.map((g) => ({ ...g, providers: uniqueProviders(availability, g.types) })).filter((g) => g.providers.length)
        : [];

    // Suggest a few other regions where the title is available.
    const suggestions = ["US", "GB", "IN", "CA", "AU", "DE"].filter((r) => r !== region && regionsAvailable.includes(r)).slice(0, 3);

    return (
        <section aria-labelledby="where-to-watch" className="bg-surface-dark border border-line rounded-3xl overflow-hidden">
            <div className="flex flex-wrap justify-between items-center gap-3 px-5 sm:px-6 pt-5 pb-4 border-line border-b">
                <div className="min-w-0">
                    <h2 id="where-to-watch" className="flex items-center gap-2 font-display font-bold text-fg text-lg">
                        <MonitorPlay size={18} className="text-primary" /> Where to watch
                    </h2>
                    <p className="mt-0.5 text-fg-muted text-xs">
                        Availability in {regionName(region)}
                    </p>
                </div>
                <RegionPicker variant="compact" />
            </div>

            <div className="space-y-5 px-5 sm:px-6 py-5">
                {(isLoading || !hydrated) && (
                    <div className="space-y-4">
                        {[0, 1].map((i) => (
                            <div key={i} className="space-y-2.5">
                                <Skeleton className="w-24 h-3" />
                                <div className="flex gap-3">
                                    {[0, 1, 2].map((j) => <Skeleton key={j} className="rounded-[22%] size-12" />)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && hydrated && groups.length === 0 && (
                    <div className="flex flex-col items-start gap-3 py-2">
                        <div className="flex items-center gap-2.5 text-fg-muted text-sm">
                            <Globe2 size={18} className="text-fg-subtle shrink-0" />
                            <span>
                                <span className="font-medium text-fg">{title}</span> isn&apos;t on any service in {regionName(region)} yet.
                            </span>
                        </div>
                        {suggestions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-fg-subtle text-xs">Available in</span>
                                {suggestions.map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => dispatch(setRegion(r))}
                                        className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-2.5 py-1 border border-line rounded-lg text-fg text-xs transition-colors"
                                    >
                                        {regionName(r)}
                                    </button>
                                ))}
                                {regionsAvailable.length > suggestions.length + 1 && (
                                    <span className="text-fg-subtle text-xs">and {regionsAvailable.length - suggestions.length} more</span>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {groups.map((group) => (
                    <div key={group.key}>
                        <div className="flex items-baseline gap-2 mb-2.5">
                            <h3 className="font-sans font-semibold text-fg text-sm">{group.label}</h3>
                            <span className="text-fg-subtle text-xs">{group.hint}</span>
                        </div>
                        <ul className="flex flex-wrap gap-2">
                            {group.providers.map((p) => {
                                const mine = myProviders.includes(p.provider_id) && (group.key === "stream" || group.key === "free");
                                return (
                                    <li key={p.provider_id}>
                                        <a
                                            href={availability!.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={`${group.label} on ${p.provider_name}`}
                                            className={cx(
                                                "group/prov flex items-center gap-2.5 py-1.5 pr-3 pl-1.5 border rounded-2xl transition-colors",
                                                mine
                                                    ? "bg-primary/10 border-primary/35 hover:bg-primary/15"
                                                    : "bg-white/3 border-line hover:bg-white/6 hover:border-line-strong",
                                            )}
                                        >
                                            <ProviderLogo name={p.provider_name} logoPath={p.logo_path} size={36} />
                                            <span className="flex flex-col min-w-0 leading-tight">
                                                <span className="max-w-36 font-medium text-fg text-sm truncate">{p.provider_name}</span>
                                                {mine && (
                                                    <span className="flex items-center gap-1 font-semibold text-[10px] text-primary-light uppercase tracking-wide">
                                                        <Sparkles size={10} /> Your service
                                                    </span>
                                                )}
                                            </span>
                                            <ArrowUpRight size={14} className="text-fg-subtle group-hover/prov:text-fg transition-colors" />
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2 bg-white/2 px-5 sm:px-6 py-3 border-line border-t">
                <p className="text-[11px] text-fg-subtle">
                    Availability data by{" "}
                    <a href="https://www.justwatch.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-fg-muted hover:text-fg">
                        JustWatch
                    </a>
                </p>
                {myProviders.length === 0 ? (
                    <Link href="/settings?tab=sources" className="font-semibold text-[11px] text-primary-light hover:text-primary">
                        Pick your services
                    </Link>
                ) : (
                    <Badge tone="accent">{myProviders.length} services</Badge>
                )}
            </div>
        </section>
    );
}
