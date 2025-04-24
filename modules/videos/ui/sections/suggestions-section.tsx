"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { videos } from "@/database/schema";
import { PAGE_DEFAULT_LIMIT } from "@/lib/constants";
import { trpc } from "@/trpc/client";
import { useAuth } from "@clerk/nextjs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VideoRowCard } from "../components/video-row-card";
import { VideoGridCard } from "../components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";

interface SuggestionsSectionProps {
  videoId: string;
  isManual?: boolean;
}

export const SuggestionsSection = ({ videoId }: SuggestionsSectionProps) => {
  return (
    <Suspense fallback={<VideoSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <SuggestionsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSkeleton = () => {
  return <Skeleton />;
};

const SuggestionsSectionSuspense = ({
  videoId,
  isManual,
}: SuggestionsSectionProps) => {
  const { isSignedIn } = useAuth();

  const utils = trpc.useUtils();
  // const router = useRouter();
  const [suggestions, query] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
      {
        videoId,
        limit: PAGE_DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  return (
    <>
      <div className="hidden md:block space-y-3">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoRowCard key={video.id} data={video} size="compact" />
          )),
        )}
      </div>
      <div className="block md:hidden space-y-10">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoGridCard key={video.id} data={video} />
          )),
        )}
      </div>
      <InfiniteScroll
        isManual={isManual}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
};
