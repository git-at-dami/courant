import { StudioView } from "@/modules/studio/ui/views/studio-view"
import { HydrateClient, trpc } from "@/trpc/server"

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