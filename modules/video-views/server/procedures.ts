import { database } from "@/database";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { videoViews } from "@/database/schema";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

export const videoViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      const [existingVideoView] = await database
        .select()
        .from(videoViews)
        .where(
          and(eq(videoViews.videoId, videoId), eq(videoViews.userId, userId)),
        );

      if (existingVideoView) {
        return existingVideoView;
      }

      const [newVideoView] = await database
        .insert(videoViews)
        .values({
          userId,
          videoId,
        })
        .returning();

      return newVideoView;
    }),
});
