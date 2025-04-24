import { trpc } from "@/trpc/client";
import { categories } from "../../database/schema";
("use client");

export const PageClient = () => {
  const [data] = trpc.categories.getMany.useSuspenseQuery();

  return <div>{JSON.stringify(data)}</div>;
};
