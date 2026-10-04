"use client";

import { useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Check, ChevronDown, Globe2, Search } from "lucide-react";
import { setRegion } from "@/store/features/preferencesSlice";
import { usePreferences, useWatchRegions } from "@/hooks/useProviders";
import { useClickOutside } from "@/hooks/useClickOutside";
import { regionName } from "@/lib/media";
import { cx } from "@/components/ui/primitives";

interface RegionPickerProps {
    /** "compact" shows only the flag and code (nav bar). */
    variant?: "compact" | "full";
    align?: "left" | "right";
    className?: string;
}

/** Country selector that drives every availability lookup in the app. */
export function RegionPicker({ variant = "full", align = "right", className }: RegionPickerProps) {
    const dispatch = useDispatch();
    const { region } = usePreferences();
    const { data: regions = [], isLoading } = useWatchRegions();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, () => setOpen(false), open);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return regions;
        return regions.filter((r) => r.english_name.toLowerCase().includes(q) || r.iso_3166_1.toLowerCase() === q);
    }, [regions, query]);

    const choose = (code: string) => {
        dispatch(setRegion(code));
        setOpen(false);
        setQuery("");
    };

    return (
        <div ref={ref} className={cx("relative", className)}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`Watch region: ${regionName(region)}`}
                className={cx(
                    "inline-flex items-center gap-2 border border-line hover:border-line-strong rounded-xl text-fg transition-colors",
                    variant === "compact" ? "h-10 px-2.5 text-sm" : "h-11 px-3.5 text-sm w-full justify-between bg-surface-raised",
                )}
            >
                <span className="flex items-center gap-2 min-w-0">
                    <Globe2 size={15} className="text-fg-muted shrink-0" />
                    <span className="font-semibold truncate">{variant === "compact" ? region : regionName(region)}</span>
                </span>
                <ChevronDown size={14} className={cx("text-fg-muted transition-transform", open && "rotate-180")} />
            </button>

            {open && (
                <div
                    className={cx(
                        "z-60 absolute bg-surface-dark shadow-2xl shadow-black/60 mt-2 border border-line-strong rounded-2xl w-72 overflow-hidden animate-fade-in",
                        align === "right" ? "right-0" : "left-0",
                    )}
                >
                    <div className="flex items-center gap-2 px-3 border-line border-b">
                        <Search size={15} className="text-fg-subtle" />
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search countries"
                            className="bg-transparent py-3 outline-none w-full text-fg placeholder:text-fg-subtle text-sm"
                        />
                    </div>
                    <div role="listbox" className="py-1 max-h-80 overflow-y-auto">
                        {isLoading && <p className="px-4 py-6 text-fg-subtle text-sm text-center">Loading regions…</p>}
                        {!isLoading && filtered.length === 0 && (
                            <p className="flex flex-col items-center gap-2 px-4 py-6 text-fg-subtle text-sm text-center">
                                <Globe2 size={18} /> No matching region
                            </p>
                        )}
                        {filtered.map((r) => (
                            <button
                                key={r.iso_3166_1}
                                type="button"
                                role="option"
                                aria-selected={r.iso_3166_1 === region}
                                onClick={() => choose(r.iso_3166_1)}
                                className={cx(
                                    "flex items-center gap-3 hover:bg-white/5 px-4 py-2.5 w-full text-sm text-left transition-colors",
                                    r.iso_3166_1 === region ? "text-primary-light" : "text-fg",
                                )}
                            >
                                <span className="w-6 font-mono text-[11px] text-fg-subtle">{r.iso_3166_1}</span>
                                <span className="flex-1 truncate">{r.english_name}</span>
                                {r.iso_3166_1 === region && <Check size={15} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
