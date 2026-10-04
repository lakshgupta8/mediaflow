import Link from "next/link";
import { User } from "lucide-react";
import type { MediaItem } from "@/services/tmdbService";
import { TmdbImage } from "./TmdbImage";
import { cx } from "@/components/ui/primitives";

interface PersonCardProps {
    item: Pick<MediaItem, "id" | "name" | "profile_path" | "known_for_department" | "character" | "job">;
    /** Line under the name; defaults to role, character or department. */
    subtitle?: string;
    className?: string;
}

export function PersonCard({ item, subtitle, className }: PersonCardProps) {
    const name = item.name || "Unknown";
    const sub = subtitle ?? item.character ?? item.job ?? item.known_for_department;

    return (
        <Link href={`/people/${item.id}`} className={cx("group/person flex flex-col gap-2.5 animate-fade-in", className)}>
            <div className="relative bg-surface-raised rounded-xl ring-1 ring-line group-hover/person:ring-primary/50 aspect-3/4 overflow-hidden transition-all">
                <TmdbImage
                    path={item.profile_path}
                    size="w185"
                    alt={name}
                    className="group-hover/person:scale-[1.04] transition-transform duration-500 ease-out-expo"
                    fallback={<User className="text-fg-subtle" size={36} />}
                />
            </div>
            <div className="min-w-0">
                <p className="font-medium text-fg group-hover/person:text-primary-light text-sm truncate transition-colors">{name}</p>
                {sub && <p className="mt-0.5 text-fg-subtle text-xs truncate">{sub}</p>}
            </div>
        </Link>
    );
}
