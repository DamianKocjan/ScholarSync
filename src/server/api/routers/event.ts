import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
  interestedIn: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const pollInterestedInEventVotes =
        await ctx.db.interestedInEvent.findMany({
          where: {
            event: {
              id: input.eventId,
            },
            user: {
              id: ctx.session.user.id,
            },
          },
        });

      if (pollInterestedInEventVotes.length > 0) {
        await ctx.db.interestedInEvent.deleteMany({
          where: {
            id: {
              in: pollInterestedInEventVotes.map((v) => v.id),
            },
          },
        });
      } else {
        await ctx.db.interestedInEvent.create({
          data: {
            event: {
              connect: {
                id: input.eventId,
              },
            },
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
      }
    }),
  isInterestedIn: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const pollInterestedInEventVotes =
        await ctx.db.interestedInEvent.findMany({
          where: {
            event: {
              id: input.eventId,
            },
            user: {
              id: ctx.session.user.id,
            },
          },
        });

      return pollInterestedInEventVotes.length > 0;
    }),
  calendar: protectedProcedure
    .input(
      z.object({
        start: z.string(),
        end: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const events = await ctx.db.event.findMany({
        where: {
          from: {
            gte: new Date(input.start),
          },
          to: {
            lte: new Date(input.end),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return events.map((event) => ({
        title: event.title,
        start: event.from,
        end: event.to,
        resource: {
          id: event.id,
          userId: event.userId,
        },
      }));
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        location: z.string(),
        from: z.string(),
        to: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.event.create({
        data: {
          title: input.title,
          description: input.description,
          location: input.location,
          from: new Date(input.from),
          to: new Date(input.to),
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              interestedInEvent: true,
              comments: true,
              interactions: true,
            },
          },
        },
      });

      return event;
    }),
});
