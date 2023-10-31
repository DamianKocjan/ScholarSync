import { z } from "zod";
import { Interaction } from "../../../types";
import { protectedProcedure, t } from "../trpc";

const model = z.enum(["post", "ofert", "event", "poll", "comment"]);

const parseModelToType = (
  model: "post" | "ofert" | "event" | "poll" | "comment"
) => {
  switch (model) {
    case "post":
      return "POST";
    case "ofert":
      return "OFERT";
    case "event":
      return "EVENT";
    case "poll":
      return "POLL";
    case "comment":
      return "COMMENT";
  }
};

export const interactionRouter = t.router({
  get: protectedProcedure
    .input(
      z.object({
        model,
        modelId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { model, modelId } = input;

      // TODO: better naming?
      const [likes, hahas, sads, angries, loves, wows] =
        await ctx.prisma.$transaction([
          ctx.prisma.interaction.count({
            where: {
              [model]: {
                id: modelId,
              },
              type: "LIKE",
            },
          }),
          ctx.prisma.interaction.count({
            where: {
              [model]: {
                id: modelId,
              },
              type: "HAHA",
            },
          }),
          ctx.prisma.interaction.count({
            where: {
              [model]: {
                id: modelId,
              },
              type: "SAD",
            },
          }),
          ctx.prisma.interaction.count({
            where: {
              [model]: {
                id: modelId,
              },
              type: "ANGRY",
            },
          }),
          ctx.prisma.interaction.count({
            where: {
              [model]: {
                id: modelId,
              },
              type: "LOVE",
            },
          }),
          ctx.prisma.interaction.count({
            where: {
              [model]: {
                id: modelId,
              },
              type: "WOW",
            },
          }),
        ]);

      const hasInteracted = ctx.session?.user
        ? await ctx.prisma.interaction.findFirst({
            where: {
              [model]: {
                id: modelId,
              },
              user: {
                id: ctx.session.user.id,
              },
            },
            select: {
              type: true,
            },
          })
        : null;

      const result: Interaction[] = [
        {
          type: "LIKE",
          count: likes,
        },
        {
          type: "HAHA",
          count: hahas,
        },
        {
          type: "SAD",
          count: sads,
        },
        {
          type: "ANGRY",
          count: angries,
        },
        {
          type: "LOVE",
          count: loves,
        },
        {
          type: "WOW",
          count: wows,
        },
      ];

      return {
        interactions: result,
        hasInteracted,
      };
    }),
  interact: protectedProcedure
    .input(
      z.object({
        model,
        modelId: z.string(),
        type: z.enum(["LIKE", "HAHA", "SAD", "ANGRY", "LOVE", "WOW"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { model, modelId, type } = input;

      const userInteractions = await ctx.prisma.interaction.findMany({
        where: {
          [model]: {
            id: modelId,
          },
          model: parseModelToType(model),
          user: {
            id: ctx.session.user.id,
          },
        },
      });

      if (userInteractions.length === 1 && userInteractions[0]!.type === type) {
        await ctx.prisma.interaction.delete({
          where: {
            id: userInteractions[0]!.id,
          },
        });
        return;
      }

      if (userInteractions.length > 0) {
        await ctx.prisma.interaction.deleteMany({
          where: {
            id: {
              in: userInteractions.map((i) => i.id),
            },
          },
        });
      }

      await ctx.prisma.interaction.create({
        data: {
          model: parseModelToType(model),
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
          type,
        },
      });
    }),
});
