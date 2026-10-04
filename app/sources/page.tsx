"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Layers, Search, Star } from "lucide-react";
import { toggleMyProvider } from "@/store/features/preferencesSlice";
import { usePreferences, useProviderCatalog } from "@/hooks/useProviders";
import { regionName } from "@/lib/media";
import type { WatchProvider } from "@/services/tmdbService";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { RegionPicker } from "@/components/providers/RegionPicker";
import { Container, cx, EmptyState, PageHeader, SectionHeader, Skeleton } from "@/components/ui/primitives";

function SourceTile({ provider, mine }: { provider: WatchProvider; mine: boolean }) {
    const dispatch = useDispatch();
    return (
        <div className="group/src relative">
            <Link
                href={`/sources/${provider.provider_id}`}
                className={cx(
                    "flex flex-col items-center gap-3 p-4 pt-5 border rounded-2xl h-full text-center transition-all",
                    mine ? "bg-primary/8 border-primary/30" : "bg-surface-dark border-line hover:border-line-strong hover:bg-surface-raised",
                    "group-hover/src:-translate-y-0.5",
                )}
            >
                <ProviderLogo name={provider.provider_name} logoPath={provider.logo_path} size={64} />
                <span className="font-medium text-fg text-sm line-clamp-2">{provider.provider_name}</span>
            </Link>
            <button
                type="button"
                onClick={() => dispatch(toggleMyProvider(provider.provider_id))}
                aria-pressed={mine}
                aria-label={mine ? `Remove ${provider.provider_name} from my services` : `Add ${provider.provider_name} to my services`}
                title={mine ? "In my services" : "Add to my services"}
                className={cx(
                    "top-2 right-2 absolute flex justify-center items-center rounded-lg size-8 transition-all",
                    mine
                        ? "bg-primary text-primary-ink"
                        : "bg-black/40 text-fg-muted opacity-0 group-hover/src:opacity-100 focus-visible:opacity-100 hover:text-fg",
                )}
            >
                <Star size={14} fill={mine ? "currentColor" : "none"} />
            </button>
        </div>
    );
}

const tileGrid = "grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3";

export default function SourcesPage() {
    const { region, myProviders } = usePreferences();
    const { data: providers = [], isLoading } = useProviderCatalog();
    const [query, setQuery] = useState("");

    const mine = providers.filter((p) => myProviders.includes(p.provider_id));
    const q = query.trim().toLowerCase();
    const filtered = q ? providers.filter((p) => p.provider_name.toLowerCase().includes(q)) : providers;

    return (
        <Container>
            <PageHeader
                eyebrow={regionName(region)}
                icon={<Layers size={22} />}
                title="Sources"
                description="Every streaming, rental and free service that carries movies or series in your region. Star the ones you pay for to personalise MediaFlow."
                actions={<RegionPicker className="w-64" />}
            />

            {mine.length > 0 && (
                <section className="mb-12">
                    <SectionHeader title="Your services" subtitle={`${mine.length} selected`} />
                    <div className={tileGrid}>
                        {mine.map((p) => <SourceTile key={p.provider_id} provider={p} mine />)}
                    </div>
                </section>
            )}

            <section>
                <SectionHeader
                    title={`All services in ${regionName(region)}`}
                    subtitle={isLoading ? "Loading…" : `${providers.length} available`}
                    action={
                        <label className="hidden sm:flex items-center gap-2 bg-surface-raised px-3 border border-line focus-within:border-primary/50 rounded-xl w-64 h-10">
                            <Search size={15} className="text-fg-subtle" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Find a service"
                                aria-label="Find a service"
                                className="bg-transparent outline-none w-full text-fg placeholder:text-fg-subtle text-sm"
                            />
                        </label>
                    }
                />
                <label className="sm:hidden flex items-center gap-2 bg-surface-raised mb-4 px-3 border border-line rounded-xl h-11">
                    <Search size={15} className="text-fg-subtle" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Find a service"
                        aria-label="Find a service"
                        className="bg-transparent outline-none w-full text-fg placeholder:text-fg-subtle text-sm"
                    />
                </label>

                {isLoading ? (
                    <div className={tileGrid}>
                        {Array.from({ length: 16 }).map((_, i) => <Skeleton key={i} className="rounded-2xl h-36" />)}
                    </div>
                ) : filtered.length ? (
                    <div className={tileGrid}>
                        {filtered.map((p) => <SourceTile key={p.provider_id} provider={p} mine={myProviders.includes(p.provider_id)} />)}
                    </div>
                ) : (
                    <EmptyState icon={<Search size={24} />} title="No services found" description={`Nothing matches “${query}” in ${regionName(region)}.`} />
                )}
            </section>
        </Container>
    );
}
