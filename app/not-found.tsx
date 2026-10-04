import { Compass } from "lucide-react";
import { ButtonLink, Container, EmptyState } from "@/components/ui/primitives";

export default function NotFound() {
    return (
        <Container>
            <EmptyState
                className="min-h-[60vh]"
                icon={<Compass size={26} />}
                title="This page drifted off"
                description="The link may be broken or the title may no longer be listed. Try browsing or searching instead."
                action={
                    <div className="flex gap-3">
                        <ButtonLink href="/">Go home</ButtonLink>
                        <ButtonLink href="/browse?type=movie" variant="outline">Browse titles</ButtonLink>
                    </div>
                }
            />
        </Container>
    );
}
