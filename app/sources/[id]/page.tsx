"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { ArrowLeft, Check, Film, Plus, Tv } from "lucide-react";
import { toggleMyProvider } from "@/store/features/preferencesSlice";
import { usePreferences, useProviderCatalog } from "@/hooks/useProviders";
import { regionName } from "@/lib/media";
import type { MediaType } from "@/services/tmdbService";
import { DiscoverView } from "@/components/discover/DiscoverView";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { Button, Container, cx, Skeleton } from "@/components/ui/primitives";

function SourceHeader({ providerId, type, setType }: { providerId: number; type: MediaType; setType: (t: MediaType) => void }) {
    const dispatch = useDispatch();
    const { region, myProviders } = usePreferences();
    const { data: catalog = [], isLoading } = useProviderCatalog();
    const provider = catalog.find((p) => p.provider_id === providerId);
    const mine = myProviders.includes(providerId);

    return (
        <header className="relative mt-6 mb-6 border border-line rounded-3xl overflow-hidden">
            {/* Soft colour wash taken from the logo itself */}
            {provider?.logo_path && (
                <div
                    aria-hidden
                    className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl scale-150"
                    style={{ backgroundImage: `url('https://image.tmdb.org/t/p/w92${provider.logo_path}')` }}
                />
            )}
            <div className="absolute inset-0 bg-linear-to-r from-surface-dark via-surface-dark/90 to-surface-dark/60" />

            <div className="relative flex md:flex-row flex-col md:items-end gap-6 p-6 sm:p-8">
                <Link href="/sources" className="top-4 right-4 absolute flex items-center gap-1.5 font-medium text-fg-muted hover:text-fg text-xs">
                    <ArrowLeft size={14} /> All sources
                </Link>

                {isLoading ? (
                    <Skeleton className="rounded-[22%] size-24" />
                ) : (
                    <ProviderLogo name={provider?.provider_name || "Source"} logoPath={provider?.logo_path} size={96} className="shadow-2xl" />
                )}

                <div className="flex-1 min-w-0">
                    <p className="mb-1 font-semibold text-[11px] text-primary uppercase tracking-[0.14em]">
                        Source · {regionName(region)}
                    </p>
                    {isLoading ? (
                        <Skeleton className="w-64 h-10" />
                    ) : (
                        <h1 className="font-display font-bold text-fg text-3xl sm:text-5xl tracking-tight">{provider?.provider_name || "Unknown source"}</h1>
                    )}
                    {!isLoading && !provider && (
                        <p className="mt-2 text-fg-muted text-sm">This service isn&apos;t listed in {regionName(region)}. Results may be empty.</p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div role="tablist" aria-label="Media type" className="flex bg-black/30 p-1 border border-line rounded-xl">
                        {([
                            { value: "movie", label: "Movies", icon: Film },
                            { value: "tv", label: "Series", icon: Tv },
                        ] as const).map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                type="button"
                                role="tab"
                                aria-selected={type === value}
                                onClick={() => setType(value)}
                                className={cx(
                                    "flex items-center gap-2 px-4 rounded-lg h-9 font-semibold text-sm transition-colors",
                                    type === value ? "bg-surface-hover text-fg" : "text-fg-muted hover:text-fg",
                                )}
                            >
                                <Icon size={15} /> {label}
                            </button>
                        ))}
                    </div>
                    <Button variant={mine ? "secondary" : "primary"} onClick={() => dispatch(toggleMyProvider(providerId))} aria-pressed={mine}>
                        {mine ? <Check size={16} /> : <Plus size={16} />}
                        {mine ? "In my services" : "Add to my services"}
                    </Button>
                </div>
            </div>
        </header>
    );
}

export default function SourcePage() {
    const params = useParams();
    const providerId = Number(params.id);

    return (
        <Container>
            <Suspense fallback={<Skeleton className="mt-6 rounded-3xl h-48" />}>
                <DiscoverView
                    fixedProviderId={providerId}
                    header={(type, setType) => <SourceHeader providerId={providerId} type={type} setType={setType} />}
                />
            </Suspense>
        </Container>
    );
}
