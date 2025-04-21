import { database } from "@/database";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { subscriptions, users, videoReactions, videos, videoUpdateSchema } from '@/database/schema';
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns, inArray, isNotNull } from 'drizzle-orm';
import { videoViews, videoVisibility } from '../../../database/schema';
import { mux } from "@/lib/mux";
import { Input } from "postcss";


export const videosRouter = createTRPCRouter({
    update: protectedProcedure.input(videoUpdateSchema).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user;

        if (!input.id) {
            throw new TRPCError({ code: "BAD_REQUEST"})
        }

        const [updatedVideo] = await database
            .update(videos)
            .set({
                title: input.title,
                description: input.description,
                categoryId: input.categoryId,
                visibility: input.visibility,
                updatedAt: new Date()
            }).where(and(
                eq(videos.id, input.id),
                eq(videos.userId, userId)
            )).returning();

        if (!updatedVideo) {
            throw new TRPCError({ code: "NOT_FOUND"})
        }
        
        return updatedVideo
    }),
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;

        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policies: ["public"],
                inputs: [
                    {
                        generated_subtitles: [
                            {
                                language_code: "en",
                                name: "English"
                            }
                        ]
                    }
                ]
            },
            cors_origin: "*"
        })

        const [video] =  await database.insert(videos).values({
            userId,
            title: "Untitled Unmastered",
            muxStatus: "waiting",
            muxUploadId: upload.id
        }).returning();

        return { video, url: upload.url };
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

        const viewerSubscriptions = database.$with("subscriptions").as(
            database.select().from(subscriptions)
            .where(inArray(subscriptions.viewerId, userId ? [userId] : []))
        );

        const [existingVideo] = await database
            .with(viewerReactions)
            .select({
                ...getTableColumns(videos),
                user: {
                    ...getTableColumns(users),
                    subscriberCount: database.$count(subscriptions, eq(subscriptions.creatorId, users.id)),
                    viewerSubscibed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean)
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
            .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId, users.id))
            .where(eq(videos.id, input.id));
            

        if (!existingVideo) {
            throw new TRPCError({ code: "NOT_FOUND" })
        }

        return existingVideo;
    })
})