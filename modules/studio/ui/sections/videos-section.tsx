"use client"

import { InfiniteScroll } from "@/components/infinite-scroll";
import { trpc } from "@/trpc/client"
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


export const VideosSection = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <VideosSectionSuspense/>
            </ErrorBoundary>
        </Suspense>
    )
}

export const VideosSectionSuspense = () => {
    const  [data, query] = trpc.studio.getMany.useSuspenseInfiniteQuery({
        limit: PAGE_DEFAULT_LIMIT
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    });

    return <div>
        <InfiniteScroll
            isManual
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
        />
    </div>
}