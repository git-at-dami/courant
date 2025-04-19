import { HydrateClient, trpc } from "@/trpc/server";


export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    userId?: string
  }>
};

export const Page = async ({ params }: PageProps) => {
  const { userId } = await params;

  void trpc.users.getOne.prefetch({ id: userId });
  
  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
};

export default Page;
