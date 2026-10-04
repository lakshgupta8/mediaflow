"use client";

import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Check, Search } from "lucide-react";
import { setMyProviders, toggleMyProvider } from "@/store/features/preferencesSlice";
import { usePreferences, useProviderCatalog } from "@/hooks/useProviders";
import { regionName } from "@/lib/media";
import { ProviderLogo } from "./ProviderLogo";
import { RegionPicker } from "./RegionPicker";
import { Button, cx, Skeleton } from "@/components/ui/primitives";

/**
 * Lets the user pick the services they subscribe to in their region.
 * Selections personalise the home page and highlight "your service" on titles.
 */
export function MyServicesPicker({ limit }: { limit?: number }) {
    const dispatch = useDispatch();
    const { region, myProviders } = usePreferences();
    const { data: providers = [], isLoading } = useProviderCatalog();
    const [query, setQuery] = useState("");
    const [showAll, setShowAll] = useState(false);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = q ? providers.filter((p) => p.provider_name.toLowerCase().includes(q)) : providers;
        return !q && limit && !showAll ? list.slice(0, limit) : list;
    }, [providers, query, limit, showAll]);

    const selectedHere = providers.filter((p) => myProviders.includes(p.provider_id)).length;

    return (
        <div className="space-y-5">
            <div className="flex sm:flex-row flex-col sm:items-center gap-3">
                <RegionPicker className="sm:w-64" align="left" />
                <label className="flex flex-1 items-center gap-2 bg-surface-raised px-3.5 border border-line focus-within:border-primary/50 rounded-xl h-11">
                    <Search size={15} className="text-fg-subtle" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={`Search ${providers.length || ""} services in ${regionName(region)}`}
                        className="bg-transparent outline-none w-full text-fg placeholder:text-fg-subtle text-sm"
                    />
                </label>
            </div>

            <div className="flex justify-between items-center text-sm">
                <p className="text-fg-muted">
                    <span className="font-semibold text-fg">{selectedHere}</span> selected in {regionName(region)}
                </p>
                {myProviders.length > 0 && (
                    <button type="button" onClick={() => dispatch(setMyProviders([]))} className="font-medium text-fg-subtle hover:text-fg">
                        Clear all
                    </button>
                )}
            </div>

            <div className="gap-2.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {isLoading &&
                    Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="rounded-2xl h-16" />)}
                {filtered.map((p) => {
                    const selected = myProviders.includes(p.provider_id);
                    return (
                        <button
                            key={p.provider_id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => dispatch(toggleMyProvider(p.provider_id))}
                            className={cx(
                                "relative flex items-center gap-3 p-2.5 pr-3 border rounded-2xl text-left transition-all",
                                selected ? "bg-primary/10 border-primary/45" : "bg-white/3 border-line hover:border-line-strong hover:bg-white/5",
                            )}
                        >
                            <ProviderLogo name={p.provider_name} logoPath={p.logo_path} size={40} />
                            <span className="flex-1 font-medium text-fg text-sm line-clamp-2">{p.provider_name}</span>
                            <span
                                className={cx(
                                    "flex justify-center items-center border rounded-full size-5 transition-colors shrink-0",
                                    selected ? "bg-primary border-primary text-primary-ink" : "border-line-strong",
                                )}
                            >
                                {selected && <Check size={12} strokeWidth={3} />}
                            </span>
                        </button>
                    );
                })}
            </div>

            {limit && !query && providers.length > limit && (
                <div className="flex justify-center">
                    <Button variant="outline" size="sm" onClick={() => setShowAll((s) => !s)}>
                        {showAll ? "Show fewer" : `Show all ${providers.length} services`}
                    </Button>
                </div>
            )}
        </div>
    );
}
