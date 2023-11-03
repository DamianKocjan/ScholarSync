import { z } from "zod";
import { authedProcedure, t } from "../trpc";

export const pollRouter = t.router({
  options: authedProcedure
    .input(
      z.object({
        pollId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const options = await ctx.prisma.option.findMany({
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
  vote: authedProcedure
    .input(
      z.object({
        optionId: z.string(),
        pollId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const pollVotes = await ctx.prisma.vote.findMany({
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
        await ctx.prisma.vote.delete({
          where: {
            id: pollVotes[0]!.id,
          },
        });
        return;
      }

      if (pollVotes.length > 0) {
        await ctx.prisma.vote.deleteMany({
          where: {
            id: {
              in: pollVotes.map((v) => v.id),
            },
          },
        });
      }

      await ctx.prisma.vote.create({
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
