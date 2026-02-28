import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface MovieRowProps {
    title: string;
    viewAllLink?: string;
    children: ReactNode;
}

export function MovieRow({ title, viewAllLink, children }: MovieRowProps) {
    return (
        <section>
            <div className="flex justify-between items-end mb-6 px-2">
                <h2 className="pl-4 border-primary border-l-4 font-bold text-white text-2xl tracking-wide">
                    {title}
                </h2>
                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className="flex items-center gap-1 font-semibold text-primary hover:text-white text-sm transition-colors"
                    >
                        View All <ChevronRight size={16} />
                    </Link>
                )}
            </div>
            <div className="flex gap-5 pb-8 overflow-x-auto snap-x no-scrollbar">
                {children}
            </div>
        </section>
    );
}
