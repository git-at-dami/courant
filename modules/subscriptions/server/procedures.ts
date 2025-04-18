import { database } from "@/database";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { subscriptions, videoReactions } from '@/database/schema';
import { z } from "zod";
import { and, eq } from 'drizzle-orm';
import { TRPCError } from "@trpc/server";


export const subscriptionsRouter = createTRPCRouter({
    // SUBSCRIBE
    create: protectedProcedure
        .input(
            z.object({
                userId: z.string().uuid()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { userId } = input;

            if (userId === ctx.user.id) {
                throw new TRPCError({
                    code: "BAD_REQUEST"
                })
            }

            const [createdSubscription] =  await database.insert(subscriptions).values({
                viewerId: ctx.user.id,
                creatorId: userId,
            })
            .returning();

            return createdSubscription;
        }),
    remove: protectedProcedure
        .input(
            z.object({
                userId: z.string().uuid()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { userId } = input;

            if (userId === ctx.user.id) {
                throw new TRPCError({
                    code: "BAD_REQUEST"
                })
            }

            const [deletedSubscription] =  await database.delete(subscriptions).where(
                and(
                    eq(subscriptions.viewerId, ctx.user.id),
                    eq(subscriptions.creatorId, userId),
                )
            )
            .returning();

            return deletedSubscription;
        })
})