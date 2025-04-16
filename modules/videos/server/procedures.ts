import { database } from "@/database";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { users, videos } from '@/database/schema';
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, getTableColumns } from 'drizzle-orm';


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
    .query(async ({ input}) => {
        const [existingVideo] = await database
            .select({
                ...getTableColumns(videos),
                user: {
                    ...getTableColumns(users),
                }
            })
            .from(videos)
            .innerJoin(users, eq(videos.userId, users.id))
            .where(eq(videos.id, input.id));
            

        if (!existingVideo) {
            throw new TRPCError({ code: "NOT_FOUND" })
        }

        return existingVideo;
    })
})