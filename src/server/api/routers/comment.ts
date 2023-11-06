import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        model: z.enum(["POST", "OFFER", "EVENT", "POLL", "RADIO_SUBMISSION"]),
        modelId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, model, modelId } = input;

      const comments = await ctx.db.comment.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        where: {
          [`${model === 'RADIO_SUBMISSION' ? 'radioSubmission' : model.toLowerCase()}Id`]: modelId,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (comments.length > limit) {
        const nextItem = comments.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        items: comments,
        nextCursor,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        model: z.enum(["POST", "OFFER", "EVENT", "POLL", "RADIO_SUBMISSION"]),
        modelId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { model, modelId, content } = input;

      await ctx.db.$transaction([
        ctx.db.comment.create({
          data: {
            content: content,
            [model === 'RADIO_SUBMISSION' ? 'radioSubmission' : model.toLowerCase()]: {
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
        ctx.db[model === 'RADIO_SUBMISSION' ? 'radioSubmission' : model.toLowerCase()].update({
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
