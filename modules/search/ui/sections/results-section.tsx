"use client"

import { useIsMobile } from "@/hooks/use-mobile";
import { PAGE_DEFAULT_LIMIT } from "@/lib/constants";
import { trpc } from "@/trpc/client";

interface ResultsSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const ResultsSection = ({
  query,
  categoryId
}: ResultsSectionProps) => {
  const isMobile = useIsMobile();
  const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery({
    limit: PAGE_DEFAULT_LIMIT,
    query,
    categoryId
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });

  return <>
    { isMobile? (
      <div className="flex flex-col gap-4 gap-y-10">
        {results.pages.flatMap((page) => page.items ).map((video) => (
          <VideoGridCard key={video.id} data={video}/>
        ))}
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        {results.pages.flatMap((page) => page.items ).map((video) => (
          <VideoRowCard key={video.id} data={video}/>
        ))}
      </div>
    )}
  </>
}