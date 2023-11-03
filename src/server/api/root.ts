import { noteRouter } from "~/server/api/routers/note";
import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { commentRouter } from "./routers/comment";
import { eventRouter } from "./routers/event";
import { feedRouter } from "./routers/feed";
import { interactionRouter } from "./routers/interaction";
import { ofertRouter } from "./routers/ofert";
import { pollRouter } from "./routers/poll";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  note: noteRouter,
  comment: commentRouter,
  event: eventRouter,
  feed: feedRouter,
  interaction: interactionRouter,
  ofert: ofertRouter,
  poll: pollRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
