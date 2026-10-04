"use client";

import Link from "next/link";
import { ArrowRight, Plus, Settings2 } from "lucide-react";
import { usePreferences, useProviderCatalog } from "@/hooks/useProviders";
import { regionName } from "@/lib/media";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { ButtonLink, Skeleton } from "@/components/ui/primitives";

/** "Your services" row on the home page, or a prompt to pick them. */
export function ServicesStrip() {
    const { region, myProviders, hydrated } = usePreferences();
    const { data: catalog = [], isLoading } = useProviderCatalog();

    const mine = catalog.filter((p) => myProviders.includes(p.provider_id));
    const showing = mine.length ? mine : catalog.slice(0, 10);

    if (!hydrated || isLoading) {
        return (
            <div className="flex gap-3 py-2 overflow-hidden">
                {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="rounded-2xl size-16 shrink-0" />)}
            </div>
        );
    }

    return (
        <section aria-labelledby="services-strip" className="bg-surface-dark/80 p-4 sm:p-5 border border-line rounded-3xl">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div>
                    <h2 id="services-strip" className="font-display font-bold text-fg text-lg">
                        {mine.length ? "Your services" : `Top services in ${regionName(region)}`}
                    </h2>
                    <p className="text-fg-muted text-xs">
                        {mine.length
                            ? `Rows below are tuned to what you subscribe to in ${regionName(region)}.`
                            : "Pick the services you use and MediaFlow will build your home around them."}
                    </p>
                </div>
                {mine.length ? (
                    <Link href="/settings?tab=sources" className="flex items-center gap-1.5 font-semibold text-fg-muted hover:text-fg text-xs">
                        <Settings2 size={14} /> Edit
                    </Link>
                ) : (
                    <ButtonLink href="/settings?tab=sources" size="sm" variant="outline">
                        <Plus size={15} /> Choose my services
                    </ButtonLink>
                )}
            </div>

            <div className="flex gap-3 -mx-1 px-1 pb-1 overflow-x-auto no-scrollbar">
                {showing.map((p) => (
                    <Link
                        key={p.provider_id}
                        href={`/sources/${p.provider_id}`}
                        className="group/svc flex flex-col items-center gap-2 w-[76px] shrink-0"
                        title={p.provider_name}
                    >
                        <ProviderLogo
                            name={p.provider_name}
                            logoPath={p.logo_path}
                            size={60}
                            className="group-hover/svc:ring-primary/60 group-hover/svc:-translate-y-0.5 transition-all"
                        />
                        <span className="w-full text-[11px] text-fg-muted group-hover/svc:text-fg text-center truncate">{p.provider_name}</span>
                    </Link>
                ))}
                <Link href="/sources" className="group/svc flex flex-col items-center gap-2 w-[76px] shrink-0">
                    <span className="flex justify-center items-center bg-white/4 group-hover/svc:bg-white/8 border border-line-strong border-dashed rounded-[22%] size-[60px] text-fg-muted group-hover/svc:text-fg transition-colors">
                        <ArrowRight size={20} />
                    </span>
                    <span className="text-[11px] text-fg-muted">All sources</span>
                </Link>
            </div>
        </section>
    );
}
