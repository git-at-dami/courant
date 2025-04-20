import { database } from "@/database";
import { subscriptions, users, videos } from "@/database/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, getTableColumns, inArray, isNotNull } from "drizzle-orm";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
    getOne:  baseProcedure.input(
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
    
        const viewerSubscriptions = database.$with("subscriptions").as(
            database.select().from(subscriptions)
            .where(inArray(subscriptions.viewerId, userId ? [userId] : []))
        );

        const [existingUser] = await database
            .with(viewerSubscriptions)
            .select({
                user: {
                    ...getTableColumns(users),
                    subscriberCount: database.$count(subscriptions, eq(subscriptions.creatorId, users.id)),
                    viewerSubscibed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean)
                },
            })
            .from(users)
            .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId, users.id))
            .where(eq(users.id, input.id));
            

        if (!existingUser) {
            throw new TRPCError({ code: "NOT_FOUND" })
        }

        return existingUser;
    })
})