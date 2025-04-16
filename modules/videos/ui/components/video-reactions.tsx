import { AlertTriangleIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { VideoGetOneOutput } from "../../types"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface VideoBannerProps {
    status: VideoGetOneOutput["muxStatus"]
}

export const VideoReactions = () => {
    const  viewerReaction = "like";
    
    return <div className="flex items-center flex-none">
        <Button 
            variant="secondary"
            className="rounded-l-full rounded-r-none gap-2 pr-4"
            >
            <ThumbsUpIcon className={cn("size-5", viewerReaction === "like" && "fill-black")}/>
        </Button>
        <Separator orientation="vertical" className="h-7" />
        <Button
            variant="secondary"
            className="rounded-l-none rounded-r-full gap-2 pl-3"
            >
            <ThumbsDownIcon className={cn("size-5", viewerReaction !== "like" && "fill-black")}/>
        </Button>
    </div>;
};