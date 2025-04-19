"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import { useAuth } from "@clerk/nextjs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UserPageBanner, UserPageBannerSkeleton } from "../components/user-page-banner";
import { UserPageInfo, UserPageInfoSkeleton } from "../components/user-page-info";
import { Separator } from "@/components/ui/separator";

interface UserSectionProps {
    userId?: string;
};

export const VideoSection = ({ userId }: UserSectionProps) => {
    return (
        <Suspense fallback={<UserSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <UserSectionSuspense userId={userId} />
            </ErrorBoundary>
        </Suspense>
    )
};

const UserSectionSkeleton = () => {
    return <div className="flex flex-col">
        <UserPageBannerSkeleton />
        <UserPageInfoSkeleton />

        <Separator />
    </div>
}

const UserSectionSuspense = ({ userId }: UserSectionProps) => {
    const { isSignedIn } = useAuth();

    const utils = trpc.useUtils();

    const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });

    return <div className="flex flex-col">
        <UserPageBanner user={user} />
        <UserPageInfo user={user} />
        <Separator />
    </div>
}