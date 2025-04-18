import { database } from "@/database";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { users, videoReactions, videos } from '@/database/schema';
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns, inArray } from 'drizzle-orm';
import { videoViews } from '../../../database/schema';


export const videosRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;

        const [video] =  await database.insert(videos).values({
            userId,
            title: "Untitled Unmastered"
        }).returning();

        return { video };
    }),
    getOne: baseProcedure.input(
        z.object({
            id: z.string().uuid()
        }))
    .query(async ({ input, ctx }) => {
        const { clerkUserId } = ctx;

        let userId;

        const [user] = await database
            .select()
            .from(users)
            .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))

        if (user) {
            userId = user.id;
        }

        const viewerReactions = database.$with("viewer_reactions").as(
            database.select({
                videoId: videoReactions.userId,
                type: videoReactions.type,
            }).from(videoReactions)
            .where(inArray(videoReactions.userId, userId ? [userId] : []))
        );

        const [existingVideo] = await database
            .with(viewerReactions)
            .select({
                ...getTableColumns(videos),
                user: {
                    ...getTableColumns(users),
                },
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
                viewerReaction: viewerReactions.type
            })
            .from(videos)
            .innerJoin(users, eq(videos.userId, users.id))
            .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
            .where(eq(videos.id, input.id));
            // .groupBy(videos.id, users.id, viewerReactions.type);
            

        if (!existingVideo) {
            throw new TRPCError({ code: "NOT_FOUND" })
        }

        return existingVideo;
    })
})