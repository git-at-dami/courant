import { PAGE_DEFAULT_LIMIT } from "@/lib/constants";
import { SubscriptionsView } from "@/modules/subscriptions/ui/views/subscriptions-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export const Page = async () => {
  void trpc.subscriptions.getMany.prefetchInfinite({
    limit: PAGE_DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <SubscriptionsView />
    </HydrateClient>
  );
};

export default Page;
