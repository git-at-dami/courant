"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { PAGE_DEFAULT_LIMIT } from "@/lib/constants";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SubscriptionItem, SubscriptionItemSkeleton } from "../components/subscription-item";


export const SubscriptionsSection = () => {
    return (
        <Suspense fallback={<SubscriptionsSkeleton/>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <SubscriptionsSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

const SubscriptionsSkeleton = () => {
    return <div className="flex flex-col gap-4">
      {
        Array.from({ length: 3 })
        .map((_, index) => (
          <SubscriptionItemSkeleton key={index} />
        ))
      }
    </div>
}

const SubscriptionsSectionSuspense = () => {
  const utils = trpc.useUtils();
    const [subscriptions, query] = trpc.subscriptions.getMany.useSuspenseInfiniteQuery({
      limit: PAGE_DEFAULT_LIMIT}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
      });

      const unsubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess: (data) => {
            utils.users.getOne.invalidate({id: data.creatorId})
            utils.videos.getManySubscribed.invalidate();
            utils.subscriptions.getMany.invalidate();
        },
        onError: (error) => {

        }
    });

    return <div>
      <div className="flex flex-col gap-4">
        {
          subscriptions.pages.flatMap((page) => page.items)
          .map((subscription) => (
            <Link prefetch key={subscription.creatorId} href={`/users/${subscription.user.id}`} >
              <SubscriptionItem
                name={subscription.user.name}
                avatarUrl={subscription.user.imageUrl}
                subscriberCount={subscription.user.subscriberCount}
                onUnSubscribe={() => {
                  unsubscribe.mutate({ userId: subscription.creatorId })
                }}
                disabled={unsubscribe.isPending}
              />
            </Link>
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