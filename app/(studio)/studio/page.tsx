import { StudioView } from "@/modules/studio/ui/views/studio-view"
import { HydrateClient, trpc } from "@/trpc/server"
import { PAGE_DEFAULT_LIMIT } from "@/lib/constants";

const Page = () => {
    void trpc.studio.getMany.prefetchInfinite({
        limit: PAGE_DEFAULT_LIMIT,
    })

    return (
        <HydrateClient>
            <StudioView />
        </HydrateClient>
    )
}

export default Page