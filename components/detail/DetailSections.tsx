"use client";

import { useState, type ReactNode } from "react";
import type { CastMember, CrewMember } from "@/services/tmdbService";
import { PersonCard } from "@/components/media/PersonCard";
import { Rail } from "@/components/media/Rail";
import { cx } from "@/components/ui/primitives";

export function Overview({ text }: { text?: string }) {
    const [expanded, setExpanded] = useState(false);
    const body = text?.trim() || "No synopsis available yet.";
    const long = body.length > 420;

    return (
        <section aria-labelledby="overview">
            <h2 id="overview" className="mb-3 font-display font-bold text-fg text-xl sm:text-2xl">Overview</h2>
            <p className={cx("max-w-3xl text-fg-muted text-base sm:text-lg leading-relaxed", long && !expanded && "line-clamp-5")}>{body}</p>
            {long && (
                <button type="button" onClick={() => setExpanded((e) => !e)} className="mt-2 font-semibold text-primary-light hover:text-primary text-sm">
                    {expanded ? "Show less" : "Read more"}
                </button>
            )}
        </section>
    );
}

export function CastRail({ cast, crew = [] }: { cast: CastMember[]; crew?: CrewMember[] }) {
    const keyCrew = crew.filter((c) => ["Director", "Screenplay", "Writer", "Original Music Composer", "Director of Photography"].includes(c.job));
    const people = [
        ...cast.slice(0, 18).map((c) => ({ ...c, subtitle: c.character })),
        ...keyCrew.slice(0, 4).map((c) => ({ ...c, character: "", subtitle: c.job })),
    ].filter((p, i, arr) => arr.findIndex((q) => q.id === p.id && q.subtitle === p.subtitle) === i);

    if (!people.length) return null;

    return (
        <Rail title="Cast & crew">
            {people.map((p) => (
                <PersonCard
                    key={`${p.id}-${p.subtitle}`}
                    item={{ id: p.id, name: p.name, profile_path: p.profile_path }}
                    subtitle={p.subtitle}
                    className="w-[112px] sm:w-[128px] shrink-0 snap-start"
                />
            ))}
        </Rail>
    );
}

export interface Fact {
    label: string;
    value: ReactNode;
}

export function FactsCard({ title, facts }: { title: string; facts: Fact[] }) {
    const visible = facts.filter((f) => f.value !== null && f.value !== undefined && f.value !== "" && f.value !== false);
    if (!visible.length) return null;

    return (
        <section aria-label={title} className="bg-surface-dark p-5 sm:p-6 border border-line rounded-3xl">
            <h2 className="mb-4 font-display font-bold text-fg text-lg">{title}</h2>
            <dl className="space-y-3.5">
                {visible.map((f) => (
                    <div key={f.label} className="flex justify-between items-start gap-4 text-sm">
                        <dt className="text-fg-subtle shrink-0">{f.label}</dt>
                        <dd className="font-medium text-fg text-right">{f.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

export const formatMoney = (n?: number) =>
    n ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(n) : null;

export const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null;

export const languageName = (code?: string) => {
    if (!code) return null;
    try {
        return new Intl.DisplayNames(["en"], { type: "language" }).of(code) || code;
    } catch {
        return code;
    }
};

export function DetailSkeleton() {
    return (
        <div className="-mt-16">
            <div className="relative h-[70vh] min-h-[520px] skeleton">
                <div className="right-0 bottom-12 left-0 absolute flex gap-10 mx-auto px-4 sm:px-6 lg:px-10 max-w-[1600px]">
                    <div className="hidden md:block bg-white/5 rounded-2xl w-64 aspect-2/3" />
                    <div className="flex-1 space-y-4 pt-20">
                        <div className="bg-white/8 rounded-lg w-40 h-5" />
                        <div className="bg-white/8 rounded-xl w-2/3 h-14" />
                        <div className="bg-white/8 rounded-lg w-1/2 h-6" />
                        <div className="flex gap-3 pt-4">
                            <div className="bg-white/8 rounded-xl w-48 h-13" />
                            <div className="bg-white/8 rounded-xl w-32 h-13" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
