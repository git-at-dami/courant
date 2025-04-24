import { formatDuration } from "@/lib/utils";
import Image from "next/image";

interface VideoThumbnailProps {
  duration: number;
  imageUrl: string | null;
  previewUrl: string | null;
  title: string;
}

export const VideoThumbnail = ({
  duration,
  imageUrl,
  title,
  previewUrl,
}: VideoThumbnailProps) => {
  return (
    <div className="relative group">
      {/* Thumbnail Wrapper */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={imageUrl ?? "/next.svg"}
          alt="thumbnail"
          fill
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          src={previewUrl ?? "/next.svg"}
          alt="preview gif"
          fill
          unoptimized
          className="size-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>

      {/* Video Duration Box */}
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
        {formatDuration(duration)}
      </div>
    </div>
  );
};
