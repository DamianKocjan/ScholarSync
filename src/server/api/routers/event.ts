import { z } from "zod";
import { protectedProcedure, t } from "../trpc";

export const eventRouter = t.router({
  interestedIn: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const polinterestedInEventlVotes =
        await ctx.prisma.interestedInEvent.findMany({
          where: {
            event: {
              id: input.eventId,
            },
            user: {
              id: ctx.session.user.id,
            },
          },
        });

      if (polinterestedInEventlVotes.length > 0) {
        await ctx.prisma.interestedInEvent.deleteMany({
          where: {
            id: {
              in: polinterestedInEventlVotes.map((v) => v.id),
            },
          },
        });
      } else {
        await ctx.prisma.interestedInEvent.create({
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
      })
    )
    .query(async ({ ctx, input }) => {
      const polinterestedInEventlVotes =
        await ctx.prisma.interestedInEvent.findMany({
          where: {
            event: {
              id: input.eventId,
            },
            user: {
              id: ctx.session.user.id,
            },
          },
        });

      return polinterestedInEventlVotes.length > 0;
    }),
  calendar: protectedProcedure
    .input(
      z.object({
        start: z.string(),
        end: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const events = await ctx.prisma.event.findMany({
        where: {
          from: {
            gte: new Date(input.start),
          },
          to: {
            lte: new Date(input.end),
          },
        },
        include: {
          user: true,
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.event.create({
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
      })
    )
    .query(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: true,
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
