import { PAGE_DEFAULT_LIMIT } from "@/lib/constants";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { TrendingView } from "@/modules/home/ui/views/trending-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export const Page = async () => {
  void trpc.videos.getManyTrending.prefetchInfinite({
    limit: PAGE_DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
};

export default Page;
