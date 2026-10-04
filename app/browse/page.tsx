"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Film, Sparkles, Tv } from "lucide-react";
import { DiscoverView } from "@/components/discover/DiscoverView";
import { Container, cx, PageHeader } from "@/components/ui/primitives";
import { useGenres } from "@/hooks/useProviders";
import type { MediaType } from "@/services/tmdbService";

function TypeSwitch({ type, setType }: { type: MediaType; setType: (t: MediaType) => void }) {
    return (
        <div role="tablist" aria-label="Media type" className="flex bg-white/5 p-1 border border-line rounded-xl">
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
                        type === value ? "bg-surface-hover text-fg shadow" : "text-fg-muted hover:text-fg",
                    )}
                >
                    <Icon size={15} /> {label}
                </button>
            ))}
            <Link
                href="/anime"
                className="flex items-center gap-2 px-4 rounded-lg h-9 font-semibold text-fg-muted hover:text-fg text-sm transition-colors"
            >
                <Sparkles size={15} /> Anime
            </Link>
        </div>
    );
}

function BrowseHeader({ type, setType }: { type: MediaType; setType: (t: MediaType) => void }) {
    const params = useSearchParams();
    const { data } = useGenres(type);
    const genreIds = (params.get("genre") || "").split(",").map(Number).filter(Boolean);
    const genreNames = (data?.genres || []).filter((g) => genreIds.includes(g.id)).map((g) => g.name);

    const noun = type === "tv" ? "Series" : "Movies";
    const title = genreNames.length === 1 ? `${genreNames[0]} ${noun.toLowerCase()}` : noun;

    return (
        <PageHeader
            eyebrow="Browse"
            title={title}
            description={`Filter every ${type === "tv" ? "series" : "movie"} by where it streams, how you can watch it, and what you're in the mood for.`}
            actions={<TypeSwitch type={type} setType={setType} />}
        />
    );
}

export default function BrowsePage() {
    return (
        <Container>
            <Suspense fallback={<div className="mt-8 rounded-xl w-64 h-10 skeleton" />}>
                <DiscoverView header={(type, setType) => <BrowseHeader type={type} setType={setType} />} />
            </Suspense>
        </Container>
    );
}
