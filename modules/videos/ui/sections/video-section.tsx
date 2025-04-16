"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VideoBanner } from "../components/video-banner";

interface VideoSectionProps {
    videoId: string;
}

export const VideoSection = ({ videoId }: VideoSectionProps) => {
    return (
        <Suspense fallback={<VideoSkeleton/>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <VideoSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

const VideoSkeleton = () => {
    return <Skeleton />
}

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
    // const router = useRouter();
    const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });

    // const onSelect = (value: string | null) => {
    //     const url = new URL(window.location.href);

    //     if (value) {
    //         url.searchParams.set("categoryId", value);
    //     } else {
    //         url.searchParams.delete("categoryId");
    //     }

    //     router.push(url.toString())
    // }
    return <div className={cn(
        "aspect-video bg-black rounded-xl overflow-hidden relative",
        video.muxStatus !== "ready" && "rounded-b-none",
    )}>
        <VideoPlayer
            autoplay
            onPlay={() => {}}
            playbackId={video.muxPlaybackId}
            thumbnailUrl={video.thumbnailUrl}
        />
        <VideoBanner status={video.muxStatus} />
        <VideoTopRow status={video} />
    </div>
};