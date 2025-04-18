import { VideoView } from "@/modules/home/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";


export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    videoId?: string
  }>
};

export const Page = async ({ searchParams }: PageProps) => {
  const { videoId } = await searchParams;

  void trpc.categories.getOne.prefetch({ id: videoId });
  
  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default Page;
