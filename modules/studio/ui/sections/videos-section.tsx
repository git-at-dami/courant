"use client"

import { trpc } from "@/trpc/client"

export const VideosSection = () => {
    const  [data] = trpc.studio.getMany.useSuspenseInfiniteQuery({
        limit: PAGE_DEFAULT_LIMIT
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    });
    
    return <div>

    </div>
}