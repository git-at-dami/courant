import { database } from "@/database";
import { videos } from "@/database/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";
import { z } from "zod";

export const searchRouter =  createTRPCRouter({
  getMany: baseProcedure.input(
    z.object({
      query: z.string().nullish(),
      categoryId: z.string().uuid().nullish(),
      cursor: z.object({
        id: z.string().uuid(),
        updatedAt: z.date(),
      }).nullish(),
      limit: z.number().min(1).max(100),
    }),
  ).query(async ({ input }) => {
    const { cursor, limit, query, categoryId } = input;

    const videosList  = await database
            .select()
            .from(videos)
            .where(and(
                ilike(
                  videos.title, `%${query}%`
                ), 
                categoryId ? eq(videos.categoryId, categoryId) : undefined,
                cursor ? or(
                    lt(videos.updatedAt, cursor.updatedAt),
                    and(
                        eq(videos.updatedAt, cursor.updatedAt),
                        lt(videos.id, cursor.id)
                    )
                ): undefined
            )).orderBy(desc(videos.updatedAt), desc(videos.id))
            
            .limit(limit + 1);
        
            const hasMore = videosList.length > limit;

            const items = hasMore ? videosList.slice(0, -1): videosList;
            const lastItem = items[items.length - 1];

            const nextCursor = hasMore ? {
                id: lastItem.id,
                updatedAt: lastItem.updatedAt,
            } : null;

        return { items, nextCursor };
  })
})