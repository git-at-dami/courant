import { categoriesRouter } from '@/modules/categories/server/procedures';
import { createTRPCRouter } from '../init';
import { videosRouter } from '@/modules/videos/server/procedures';
import { studioRouter } from '@/modules/studio/server/procedures';
import { videoViewsRouter } from '@/modules/video-views/server/procedures';
import { videoReactionsRouter } from '@/modules/video-reactions/server/procedures';
import { subscriptionsRouter } from '@/modules/subscriptions/server/procedures';
export const appRouter = createTRPCRouter({
    users: usersRouter,
    categories: categoriesRouter,
    studio: studioRouter,
    videos: videosRouter,
    videoViews: videoViewsRouter,
    videoReactions: videoReactionsRouter,
    subscriptions: subscriptionsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;