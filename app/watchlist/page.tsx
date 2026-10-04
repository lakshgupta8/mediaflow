import type { Metadata } from "next";
import { LibraryView } from "@/components/library/LibraryView";

export const metadata: Metadata = { title: "Watchlist" };

export default function WatchlistPage() {
    return <LibraryView kind="watchlist" />;
}
