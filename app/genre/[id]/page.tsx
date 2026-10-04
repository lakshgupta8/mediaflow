import { redirect } from "next/navigation";

/** Genre pages now live in Browse, which adds source and availability filters. */
export default async function GenreRedirect({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ type?: string }>;
}) {
    const { id } = await params;
    const { type } = await searchParams;
    redirect(`/browse?type=${type === "tv" ? "tv" : "movie"}&genre=${encodeURIComponent(id)}`);
}
