import { database } from "@/database";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { videoReactions, videos, videoViews } from '@/database/schema';
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";


export const studioRouter = createTRPCRouter({
    getOne: protectedProcedure
    .input(
        z.object({
            id: z.string().uuid(),  
        })
    )
    .query(async ({ ctx, input}) => {
        const { id } = input;
        const { id: userId } = ctx.user;

        const [video]  = await database
            .select()
            .from(videos)
            .where(
                and(
                    eq(videos.id, id),
                    eq(videos.userId, userId),
                )
            );
        
        if (!video) {
            throw new TRPCError({code: "NOT_FOUND"})
        }
        
        return video;
    }),
    getMany: protectedProcedure
    .input(
        z.object({
            cursor: z.object({
                id: z.string().uuid(),
                updatedAt: z.date(),
            })
            .nullish(),
            limit: z.number().min(1).max(100)
        })
    )
    .query(async ({ ctx, input}) => {
        const { cursor, limit } = input;
        const { id: userId } = ctx.user;

        const videosList  = await database
            .select({
                ...getTableColumns(videos),
                videoViews: database.$count(videoViews, eq(videoViews.videoId, videos.id)),
                likeCount: database.$count(
                    videoReactions,
                    and(
                    eq(videoViews.videoId, videos.id),
                    eq(videoReactions.type, "like")
                )),
                dislikeCount: database.$count(
                    videoReactions,
                    and(
                    eq(videoViews.videoId, videos.id),
                    eq(videoReactions.type, "dislike")
                )),
            })
            .from(videos)
            .leftJoin(videoReactions, eq(videoReactions.videoId, videos.id))
            .leftJoin(videoViews, eq(videoViews.videoId, videos.id))
            .where(and(
                eq(videos.userId, userId), cursor ? or(
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
    }),
});