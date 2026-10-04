import type { Metadata } from "next";
import { LibraryView } from "@/components/library/LibraryView";

export const metadata: Metadata = { title: "Recently watched" };

export default function RecentPage() {
    return <LibraryView kind="recent" />;
}
