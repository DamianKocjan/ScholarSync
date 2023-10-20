import { z } from "zod";
import { authedProcedure, t } from "../trpc";

export const commentRouter = t.router({
  getAll: authedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        model: z.enum(["post", "ofert", "event", "poll"]),
        modelId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, model, modelId } = input;

      const comments = await ctx.prisma.comment.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        where: {
          [`${model}Id`]: modelId,
        },
        include: {
          user: true,
        },
      });

      let nextCursor: string | undefined = undefined;
      if (comments.length > limit) {
        const nextItem = comments.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: comments,
        nextCursor,
      };
    }),
  create: authedProcedure
    .input(
      z.object({
        model: z.enum(["post", "ofert", "event", "poll"]),
        modelId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { model, modelId, content } = input;

      await ctx.prisma.$transaction([
        ctx.prisma.comment.create({
          data: {
            content: content,
            [model]: {
              connect: {
                id: modelId,
              },
            },
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        }),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ctx.prisma[model].update({
          where: {
            id: modelId,
          },
          data: {
            numberOfComments: {
              increment: 1,
            },
          },
        }),
      ]);
    }),
});
