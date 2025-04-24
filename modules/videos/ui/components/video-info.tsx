import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { VideoGetManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { VideoMenu } from "./video-menu";

interface VideoInfoProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoInfo = ({ data, onRemove }: VideoInfoProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(data.viewCount);
  }, [data.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(data.createdAt, { addSuffix: true });
  }, [data.createdAt]);

  return (
    <div className="flex gap-3">
      <Link prefetch href={`/users/${data.user.id}`}>
        <UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link prefetch href={`/videos/${data.id}`} className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-medium line-clamp-1 lg:line-clamp-2 break-words",
              "text-base",
            )}
          >
            {data.title}
          </h3>
        </Link>
        <Link prefetch href={`/users/${data.user.id}`}>
          <UserInfo name={data.user.name} />
        </Link>
        <Link prefetch href={`/videos/${data.id}`}>
          <p className="text-sm textgray-600 line-clamp-1">
            {compactViews} views &bull; {compactDate}
          </p>
        </Link>
      </div>
      <div className="flex-shrink-0">
        <VideoMenu videoId={data.id} onRemove={onRemove} />
      </div>
    </div>
  );
};
