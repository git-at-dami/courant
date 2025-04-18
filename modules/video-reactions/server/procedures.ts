import { database } from "@/database";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { videoReactions } from '@/database/schema';
import { z } from "zod";
import { and, eq } from 'drizzle-orm';


export const videoReactionsRouter = createTRPCRouter({
    like: protectedProcedure
        .input(
            z.object({
                videoId: z.string().uuid()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { videoId } = input;

            const [existingLikeReaction] = await database
                .select()
                .from(videoReactions)
                .where(
                    and(
                        eq(videoReactions.videoId, videoId),
                        eq(videoReactions.userId, userId),
                        eq(videoReactions.type, "like"),
                    )  
                );
                

            if (existingLikeReaction) {
            const [deletedViewerReaction] = await database
                .delete(videoReactions)
                .where(and(
                    eq(videoReactions.videoId, videoId),
                    eq(videoReactions.userId, userId),
                )).returning();

                return deletedViewerReaction;
            }

            // UPSERT IN CASE OF EXISTING DISLIKE
            const [newLikeReaction] =  await database.insert(videoReactions).values({
                userId,
                videoId,
                type: "like"
            })
            .onConflictDoUpdate({
                target: [videoReactions.userId, videoReactions.videoId],
                set: {
                    type: "like",
                }
            })
            .returning();

            return newLikeReaction;
        }),
    dislike: protectedProcedure
        .input(
            z.object({
                videoId: z.string().uuid()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { videoId } = input;

            const [existingDislikeReaction] = await database
                .select()
                .from(videoReactions)
                .where(
                    and(
                        eq(videoReactions.videoId, videoId),
                        eq(videoReactions.userId, userId),
                        eq(videoReactions.type, "dislike"),
                    )  
                );
                

            if (existingDislikeReaction) {
            const [deletedViewerReaction] = await database
                .delete(videoReactions)
                .where(and(
                    eq(videoReactions.videoId, videoId),
                    eq(videoReactions.userId, userId),
                )).returning();

                return deletedViewerReaction;
            }

            // UPSERT IN CASE OF EXISTING LIKE
            const [newLikeReaction] =  await database.insert(videoReactions).values({
                userId,
                videoId,
                type: "dislike"
            })
            .onConflictDoUpdate({
                target: [videoReactions.userId, videoReactions.videoId],
                set: {
                    type: "dislike",
                }
            })
            .returning();

            return newLikeReaction;
        }),
})