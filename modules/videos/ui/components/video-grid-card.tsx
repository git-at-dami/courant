import { VideoGetManyOutput } from "../../types";
import Link from "next/link";
import { VideoThumbnail } from "./video-thumbnail";
import { VideoInfo } from "./video-info";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoGridCardProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoGridCardSkeleton = () => {
  return (
    <div>
      <Skeleton />
    </div>
  )
}

export const VideoGridCard = ({
  data,
  onRemove,
}: VideoGridCardProps) => {
  return <div className="flex flex-col gap-2  w-full group">
    <Link href={`/videos/${data.id}`}>
      <VideoThumbnail duration={data.duration} imageUrl={data.thumbnailUrl} previewUrl={data.previewUrl} title={data.title} />
    </Link>
    <VideoInfo data={data} onRemove={onRemove}/>
  </div>
}