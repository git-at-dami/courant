import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";

interface UseSubscriptionProps {
    userId: string;
    isSubscribed: boolean;
    fromVideoId?: string;
}

export const useSubscription = ({
    userId,
    isSubscribed,
    fromVideoId
}: UseSubscriptionProps) => {
    const clerk = useClerk();
    const utils = trpc.useUtils();

    const subscribe = trpc.subscriptions.create.useMutation({
        onSuccess: () => {
            if (fromVideoId) {
                utils.videos.getOne.invalidate({ id: fromVideoId })
            }
            utils.users.getOne.invalidate({id: userId});
            utils.videos.getManySubscribed.invalidate();
            utils.subscriptions.getMany.invalidate();
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    });
    const unsubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess: () => {
            if (fromVideoId) {
                utils.videos.getOne.invalidate({ id: fromVideoId })
            }
            utils.users.getOne.invalidate({id: userId})
            utils.videos.getManySubscribed.invalidate();
            utils.subscriptions.getMany.invalidate();
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    });

    const isPending = subscribe.isPending || unsubscribe.isPending;

    const onClick = () => {
        if (isSubscribed) {
            unsubscribe.mutate({ userId });
        } else {
            subscribe.mutate({ userId })
        }
    }

    return {
        isPending,
        onClick
    }
}