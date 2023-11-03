import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const pollRouter = createTRPCRouter({
  options: protectedProcedure
    .input(
      z.object({
        pollId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const options = await ctx.db.option.findMany({
        where: {
          pollId: input.pollId,
        },
        include: {
          _count: {
            select: {
              votes: true,
            },
          },
          votes: ctx.session?.user
            ? {
                where: {
                  user: {
                    id: ctx.session.user.id,
                  },
                },
              }
            : undefined,
        },
      });
      return {
        result: options,
      };
    }),
  vote: protectedProcedure
    .input(
      z.object({
        optionId: z.string(),
        pollId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const pollVotes = await ctx.db.vote.findMany({
        where: {
          option: {
            pollId: input.pollId,
          },
          user: {
            id: ctx.session.user.id,
          },
        },
      });

      if (pollVotes.length === 1 && pollVotes[0]!.optionId === input.optionId) {
        await ctx.db.vote.delete({
          where: {
            id: pollVotes[0]!.id,
          },
        });
        return;
      }

      if (pollVotes.length > 0) {
        await ctx.db.vote.deleteMany({
          where: {
            id: {
              in: pollVotes.map((v) => v.id),
            },
          },
        });
      }

      await ctx.db.vote.create({
        data: {
          option: {
            connect: {
              id: input.optionId,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
