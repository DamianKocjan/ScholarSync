import { createTRPCRouter } from "~/server/api/trpc";
import { commentRouter } from "./routers/comment";
import { eventRouter } from "./routers/event";
import { feedRouter } from "./routers/feed";
import { interactionRouter } from "./routers/interaction";
import { offerRouter } from "./routers/offer";
import { pollRouter } from "./routers/poll";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  comment: commentRouter,
  event: eventRouter,
  feed: feedRouter,
  interaction: interactionRouter,
  offer: offerRouter,
  poll: pollRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
