import { database } from "@/database";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { categories, videos } from '@/database/schema';


export const videosRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;

        const [video] =  await database.insert(videos).values({
            userId,
            title: "Untitled Unmastered"
        }).returning();

        return { video };
    }),
});