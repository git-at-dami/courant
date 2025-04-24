"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { videos } from "@/database/schema";
import { PAGE_DEFAULT_LIMIT } from "@/lib/constants";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface VideosSectionProps {
    categoryId?: string;
}

export const VideosSection = ({ categoryId }: VideosSectionProps) => {
    return (
        <Suspense key={categoryId} fallback={<VideosSkeleton/>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <VideosSectionSuspense categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    )
}

const VideosSkeleton = () => {
    return <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 
    lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
    [@media(min-width:1920px):grid-cols-5 [@media(min-width:2200px):grid-cols-6]
    ">
      {
        Array.from({ length: 18 })
        .map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))
      }
    </div>
}

const VideosSectionSuspense = ({ categoryId }: VideosSectionProps) => {
    const router = useRouter();
    const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery({
      categoryId,
      limit: PAGE_DEFAULT_LIMIT}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
      });

    return <div>
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 
      lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
      [@media(min-width:1920px):grid-cols-5 [@media(min-width:2200px):grid-cols-6]
      ">
        {
          videos.pages.flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))
        }
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
};