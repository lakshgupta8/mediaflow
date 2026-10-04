"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Cake, ChevronDown, Clapperboard, Film, MapPin, Star, Tv, User, UserX } from "lucide-react";
import { tmdbService, type MediaItem } from "@/services/tmdbService";
import { formatRating, mediaHref, mediaTitle, mediaTypeOf } from "@/lib/media";
import { TmdbImage } from "@/components/media/TmdbImage";
import { MediaRail } from "@/components/media/Rail";
import { Badge, Button, Container, EmptyState, SectionHeader, Skeleton, cx } from "@/components/ui/primitives";

/** Combined-credit rows carry a few fields the shared MediaItem type leaves out. */
type Credit = MediaItem & { episode_count?: number; department?: string };

interface FilmographyRow {
    key: string;
    item: Credit;
    year: number | null;
    role: string;
}

type CreditTab = "cast" | "crew";

const INITIAL_ROWS = 15;
const BIO_LIMIT = 520;
/** Talk shows, news and award broadcasts inflate vote counts without being "known for" material. */
const NON_FILM_GENRES = new Set([10763, 10767]);
const SELF_ROLE = /\b(self|himself|herself|themselves|host|narrator \(voice\))\b/i;

const creditDate = (item: Credit) => item.release_date || item.first_air_date || "";
const creditYear = (item: Credit) => {
    const date = creditDate(item);
    return date ? Number(date.slice(0, 4)) || null : null;
};

const formatDate = (value?: string | null) => {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
        ? null
        : date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
};

const yearsBetween = (from: string, to: Date) => {
    const birth = new Date(`${from}T00:00:00`);
    if (Number.isNaN(birth.getTime())) return null;
    let age = to.getFullYear() - birth.getFullYear();
    const beforeBirthday = to.getMonth() < birth.getMonth() || (to.getMonth() === birth.getMonth() && to.getDate() < birth.getDate());
    if (beforeBirthday) age -= 1;
    return age >= 0 ? age : null;
};

/** Merge duplicate rows (same title, several characters or jobs) and sort newest first, undated on top. */
function buildFilmography(credits: Credit[], field: "character" | "job"): FilmographyRow[] {
    const byTitle = new Map<string, FilmographyRow>();
    credits.forEach((item) => {
        const key = `${mediaTypeOf(item)}-${item.id}`;
        const role = (item[field] || "").trim();
        const existing = byTitle.get(key);
        if (existing) {
            if (role && !existing.role.split(", ").includes(role)) existing.role = existing.role ? `${existing.role}, ${role}` : role;
            return;
        }
        byTitle.set(key, { key, item, year: creditYear(item), role });
    });

    return Array.from(byTitle.values()).sort((a, b) => {
        if (a.year === null && b.year === null) return 0;
        if (a.year === null) return -1;
        if (b.year === null) return 1;
        return creditDate(b.item).localeCompare(creditDate(a.item));
    });
}

export default function PersonPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = Number(params.id);

    const { data: person, isLoading, isError, refetch, dataUpdatedAt } = useQuery({
        queryKey: ["person", id],
        queryFn: () => tmdbService.getPersonDetails(id),
        enabled: Number.isFinite(id) && id > 0,
        staleTime: 1000 * 60 * 30,
    });

    const [bioExpanded, setBioExpanded] = useState(false);
    const [tab, setTab] = useState<CreditTab | null>(null);
    const [showAll, setShowAll] = useState(false);

    const cast = useMemo(() => (person?.combined_credits?.cast || []) as Credit[], [person]);
    const crew = useMemo(() => (person?.combined_credits?.crew || []) as Credit[], [person]);

    const knownFor = useMemo(() => {
        const prefersCrew = person?.known_for_department && person.known_for_department !== "Acting" && crew.length > 0;
        const primary = prefersCrew ? crew : cast;
        const pool = [...primary, ...(prefersCrew ? cast : crew)];
        const seen = new Set<string>();
        return pool
            .filter((item) => item.poster_path)
            .filter((item) => !item.genre_ids?.some((g) => NON_FILM_GENRES.has(g)))
            .filter((item) => !SELF_ROLE.test(item.character || ""))
            .sort((a, b) => {
                // Keep the person's main department first, then most-voted.
                const aPrimary = primary.includes(a) ? 1 : 0;
                const bPrimary = primary.includes(b) ? 1 : 0;
                if (aPrimary !== bPrimary) return bPrimary - aPrimary;
                return (b.vote_count || 0) - (a.vote_count || 0);
            })
            .filter((item) => {
                const key = `${mediaTypeOf(item)}-${item.id}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .slice(0, 20)
            .map((item) => ({ ...item, media_type: mediaTypeOf(item) }));
    }, [person, cast, crew]);

    const acting = useMemo(() => buildFilmography(cast, "character"), [cast]);
    const production = useMemo(() => buildFilmography(crew, "job"), [crew]);

    const totalCredits = useMemo(() => {
        const keys = new Set<string>();
        [...cast, ...crew].forEach((item) => keys.add(`${mediaTypeOf(item)}-${item.id}`));
        return keys.size;
    }, [cast, crew]);

    const backdrop = useMemo(
        () => [...cast, ...crew].filter((c) => c.backdrop_path).sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))[0]?.backdrop_path,
        [cast, crew],
    );

    if (isLoading) return <PersonSkeleton />;

    if (isError || !person) {
        return (
            <Container>
                <EmptyState
                    icon={<UserX size={28} />}
                    title="We couldn't load this person"
                    description="The profile may not exist, or TMDB is temporarily unavailable. Try again in a moment."
                    action={
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => router.back()}>
                                <ArrowLeft size={16} />
                                Go back
                            </Button>
                            {isError && <Button onClick={() => refetch()}>Try again</Button>}
                        </div>
                    }
                />
            </Container>
        );
    }

    const name = person.name || "Unknown";
    const defaultTab: CreditTab = person.known_for_department !== "Acting" && production.length > 0 ? "crew" : acting.length > 0 ? "cast" : "crew";
    const activeTab = tab ?? defaultTab;
    const rows = activeTab === "cast" ? acting : production;
    const visibleRows = showAll ? rows : rows.slice(0, INITIAL_ROWS);

    const born = formatDate(person.birthday);
    const died = formatDate(person.deathday);
    const age = person.birthday
        ? yearsBetween(person.birthday, person.deathday ? new Date(`${person.deathday}T00:00:00`) : new Date(dataUpdatedAt))
        : null;

    const bio = person.biography?.trim() || "";
    const bioIsLong = bio.length > BIO_LIMIT;

    type Fact = { label: string; value: string; icon: ReactNode };
    const facts: Fact[] = [];
    if (born) facts.push({ label: "Born", value: born, icon: <Cake size={15} /> });
    if (person.place_of_birth) facts.push({ label: "Birthplace", value: person.place_of_birth, icon: <MapPin size={15} /> });
    if (died) facts.push({ label: "Died", value: `${died}${age !== null ? ` (aged ${age})` : ""}`, icon: <User size={15} /> });
    else if (age !== null) facts.push({ label: "Age", value: `${age} years`, icon: <User size={15} /> });
    if (totalCredits > 0) facts.push({ label: "Known credits", value: totalCredits.toLocaleString(), icon: <Clapperboard size={15} /> });

    const selectTab = (next: CreditTab) => {
        setTab(next);
        setShowAll(false);
    };

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <section className="relative -mt-16 pt-16 overflow-hidden isolate">
                <div aria-hidden className="-z-10 absolute inset-0">
                    {backdrop && (
                        <div className="absolute inset-0 opacity-30 blur-sm scale-105">
                            <TmdbImage path={backdrop} size="w1280" alt="" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-b from-background-dark/70 via-background-dark/85 to-background-dark" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(19_236_91/0.18),transparent_60%)]" />
                </div>

                <Container className="pt-8 sm:pt-14 pb-10">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-1.5 mb-8 font-medium text-fg-muted hover:text-fg text-sm transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <div className="flex md:flex-row flex-col md:items-end gap-8 lg:gap-12">
                        <div className="relative bg-surface-raised shadow-2xl shadow-black/60 mx-auto md:mx-0 rounded-3xl ring-1 ring-line-strong w-52 sm:w-60 lg:w-72 aspect-2/3 overflow-hidden shrink-0">
                            <TmdbImage
                                path={person.profile_path}
                                size="h632"
                                alt={name}
                                priority
                                fallback={<User size={64} className="text-fg-subtle" />}
                            />
                        </div>

                        <div className="flex-1 min-w-0 md:text-left text-center">
                            {person.known_for_department && (
                                <Badge tone="accent" className="mb-4">
                                    {person.known_for_department === "Acting" ? "Actor" : person.known_for_department}
                                </Badge>
                            )}
                            <h1 className="font-display font-extrabold text-fg text-4xl sm:text-5xl lg:text-7xl leading-[0.95] tracking-tight">{name}</h1>

                            {facts.length > 0 && (
                                <dl className="gap-3 grid grid-cols-2 lg:grid-cols-4 mt-8 text-left">
                                    {facts.map((fact) => (
                                        <div key={fact.label} className="bg-white/4 backdrop-blur-sm px-4 py-3 border border-line rounded-2xl min-w-0">
                                            <dt className="flex items-center gap-1.5 font-semibold text-[11px] text-fg-subtle uppercase tracking-[0.12em]">
                                                <span className="text-primary">{fact.icon}</span>
                                                {fact.label}
                                            </dt>
                                            <dd className="mt-1 font-medium text-fg text-sm line-clamp-2">{fact.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            )}
                        </div>
                    </div>
                </Container>
            </section>

            <Container className="flex flex-col gap-14">
                {/* Biography */}
                <section aria-labelledby="bio-heading" className="max-w-4xl">
                    <SectionHeader title={<span id="bio-heading">Biography</span>} />
                    {bio ? (
                        <>
                            <div
                                id="person-bio"
                                className={cx(
                                    "relative space-y-4 text-fg-muted text-base leading-relaxed",
                                    bioIsLong && !bioExpanded && "max-h-48 overflow-hidden",
                                )}
                            >
                                {bio.split(/\n+/).map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                                {bioIsLong && !bioExpanded && (
                                    <div aria-hidden className="right-0 bottom-0 left-0 absolute bg-linear-to-t from-background-dark to-transparent h-20" />
                                )}
                            </div>
                            {bioIsLong && (
                                <button
                                    type="button"
                                    onClick={() => setBioExpanded((v) => !v)}
                                    aria-expanded={bioExpanded}
                                    aria-controls="person-bio"
                                    className="inline-flex items-center gap-1 mt-3 font-semibold text-primary-light hover:text-primary text-sm transition-colors"
                                >
                                    {bioExpanded ? "Show less" : "Read more"}
                                    <ChevronDown size={16} className={cx("transition-transform", bioExpanded && "rotate-180")} />
                                </button>
                            )}
                        </>
                    ) : (
                        <p className="text-fg-subtle">We don&apos;t have a biography for {name} yet.</p>
                    )}
                </section>

                {/* Known for */}
                {knownFor.length > 0 && <MediaRail eyebrow="Highlights" title="Known for" items={knownFor} />}

                {/* Filmography */}
                {(acting.length > 0 || production.length > 0) && (
                    <section aria-labelledby="filmography-heading">
                        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-4 mb-5">
                            <div>
                                <div className="mb-1 font-semibold text-[11px] text-primary uppercase tracking-[0.14em]">Career</div>
                                <h2 id="filmography-heading" className="font-display font-bold text-fg text-xl sm:text-2xl">Filmography</h2>
                            </div>
                            <div role="tablist" aria-label="Credit type" className="inline-flex self-start bg-white/5 p-1 border border-line rounded-xl">
                                {(
                                    [
                                        { value: "cast", label: "Acting", count: acting.length },
                                        { value: "crew", label: "Crew", count: production.length },
                                    ] as const
                                ).map((t) => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        role="tab"
                                        id={`tab-${t.value}`}
                                        aria-selected={activeTab === t.value}
                                        aria-controls="filmography-panel"
                                        disabled={t.count === 0}
                                        onClick={() => selectTab(t.value)}
                                        className={cx(
                                            "flex items-center gap-2 px-4 rounded-lg h-9 font-semibold text-sm transition-colors disabled:opacity-40",
                                            activeTab === t.value ? "bg-fg text-background-dark" : "text-fg-muted hover:text-fg",
                                        )}
                                    >
                                        {t.label}
                                        <span className="opacity-60 text-xs tabular-nums">{t.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div id="filmography-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="bg-surface-dark border border-line rounded-2xl overflow-hidden">
                            <ol className="divide-y divide-line">
                                {visibleRows.map((row, i) => {
                                    const prev = visibleRows[i - 1];
                                    const newYear = i === 0 || prev.year !== row.year;
                                    return <FilmographyItem key={row.key} row={row} showYear={newYear} />;
                                })}
                            </ol>
                            {rows.length > INITIAL_ROWS && (
                                <div className="p-3 border-line border-t">
                                    <Button variant="ghost" className="w-full" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll}>
                                        {showAll ? "Show less" : `Show all ${rows.length} credits`}
                                        <ChevronDown size={16} className={cx("transition-transform", showAll && "rotate-180")} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </Container>
        </div>
    );
}

function FilmographyItem({ row, showYear }: { row: FilmographyRow; showYear: boolean }) {
    const { item } = row;
    const type = mediaTypeOf(item);
    const title = mediaTitle(item);
    const rating = item.vote_count && item.vote_count > 10 ? formatRating(item.vote_average) : null;
    const episodes = type === "tv" && item.episode_count ? `${item.episode_count} ${item.episode_count === 1 ? "episode" : "episodes"}` : null;

    return (
        <li className="flex items-center gap-4 hover:bg-white/3 px-4 sm:px-5 py-3 transition-colors">
            <span className={cx("w-12 font-display font-semibold text-sm tabular-nums shrink-0", showYear ? "text-fg" : "text-transparent select-none")}>
                {row.year ?? "TBA"}
            </span>
            <Link href={mediaHref({ ...item, media_type: type })} className="group/row flex flex-1 items-center gap-3 min-w-0">
                <span className="relative bg-surface-raised rounded-md ring-1 ring-line w-9 aspect-2/3 overflow-hidden shrink-0">
                    <TmdbImage
                        path={item.poster_path}
                        size="w92"
                        alt=""
                        fallback={type === "tv" ? <Tv size={14} className="text-fg-subtle" /> : <Film size={14} className="text-fg-subtle" />}
                    />
                </span>
                <span className="min-w-0">
                    <span className="block font-medium text-fg group-hover/row:text-primary-light text-sm truncate transition-colors">{title}</span>
                    {(row.role || episodes) && (
                        <span className="block text-fg-subtle text-xs truncate">
                            {row.role && <>as {row.role}</>}
                            {row.role && episodes && " · "}
                            {episodes}
                        </span>
                    )}
                </span>
            </Link>
            {rating && (
                <span className="hidden sm:flex items-center gap-1 text-fg-muted text-xs tabular-nums">
                    <Star size={12} className="fill-warning text-warning" />
                    {rating}
                </span>
            )}
            <Badge className="shrink-0">{type === "tv" ? "Series" : "Movie"}</Badge>
        </li>
    );
}

function PersonSkeleton() {
    return (
        <Container className="pt-8 sm:pt-14">
            <div aria-busy="true" aria-label="Loading person" className="flex md:flex-row flex-col md:items-end gap-8 lg:gap-12">
                <Skeleton className="mx-auto md:mx-0 rounded-3xl w-52 sm:w-60 lg:w-72 aspect-2/3 shrink-0" />
                <div className="flex flex-col flex-1 md:items-start items-center gap-4">
                    <Skeleton className="rounded-md w-20 h-5" />
                    <Skeleton className="w-3/4 max-w-md h-14" />
                    <div className="gap-3 grid grid-cols-2 lg:grid-cols-4 mt-4 w-full">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="rounded-2xl h-16" />
                        ))}
                    </div>
                </div>
            </div>
            <div className="space-y-3 mt-14 max-w-4xl">
                <Skeleton className="mb-5 w-40 h-7" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className={cx("rounded-md h-4", i === 4 ? "w-2/3" : "w-full")} />
                ))}
            </div>
        </Container>
    );
}
