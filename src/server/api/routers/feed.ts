import { TRPCError } from "@trpc/server";
import cuid from "cuid";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const feedRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const content = await ctx.db.activity.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!content) {
        throw new Error("NOT_FOUND");
      }

      // @ts-expect-error This is fine
      const activity = await ctx.db[content.type].findUnique({
        where: {
          id: content.id,
        },
      });

      return {
        result: activity,
      };
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        exclude: z.string().optional(),
        type: z
          .enum(["POST", "OFFER", "EVENT", "POLL", "RADIO_SUBMISSION"])
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, exclude, type } = input;

      const content = await ctx.db.activity.findMany({
        take: limit + 1,
        where: {
          id: {
            not: exclude,
          },
          type,
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      const feed = await Promise.all(
        content.map(async (contentItem) => {
          let item;

          if (contentItem.type === "OFFER") {
            item = await ctx.db.offer.findUnique({
              where: { id: contentItem.id },
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
                    comments: true,
                  },
                },
              },
            });
          } else if (contentItem.type === "POST") {
            item = await ctx.db.post.findUnique({
              where: { id: contentItem.id },
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
                    comments: true,
                  },
                },
              },
            });
          } else if (contentItem.type === "EVENT") {
            item = await ctx.db.event.findUnique({
              where: { id: contentItem.id },
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
                    comments: true,
                    interestedInEvent: true,
                  },
                },
              },
            });
          } else if (contentItem.type === "RADIO_SUBMISSION") {
            item = await ctx.db.radioSubmission.findUnique({
              where: { id: contentItem.id },
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
                    comments: true,
                  },
                },
              },
            });
          } else {
            item = await ctx.db.poll.findUnique({
              where: { id: contentItem.id },
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
                    comments: true,
                  },
                },
              },
            });
          }

          return {
            ...item,
            id: contentItem.id,
            type: contentItem.type,
          };
        }),
      );

      let nextCursor: string | undefined = undefined;
      if (feed.length > limit) {
        const nextItem = feed.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        items: feed,
        nextCursor,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        type: z.enum(["POST", "OFFER", "EVENT", "POLL", "RADIO_SUBMISSION"]),
        data: z.object({
          event: z
            .object({
              title: z.string(),
              description: z.string(),
              from: z.string(),
              to: z.string(),
              location: z.string(),
            })
            .optional(),
          offer: z
            .object({
              title: z.string(),
              description: z.string(),
              price: z.number(),
              condition: z.enum(["NEW", "USED", "UNKNOWN"]),
              image: z.string(),
              category: z.string(),
            })
            .optional(),
          poll: z
            .object({
              title: z.string(),
              description: z.string(),
              options: z.array(z.string()).min(2).max(10),
            })
            .optional(),
          post: z
            .object({
              title: z.string(),
              content: z.string(),
            })
            .optional(),
          radio_submission: z
            .object({
              title: z.string(),
              content: z.string(),
              link: z.string(),
            })
            .optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { type, data } = input;

      const id = cuid();

      if (type === "POLL") {
        if (!data.poll) {
          throw new Error("INVALID_DATA");
        }

        await ctx.db.$transaction([
          ctx.db.activity.create({
            data: {
              id,
              type,
            },
          }),
          ctx.db.poll.create({
            data: {
              id,
              title: data.poll.title,
              description: data.poll.description,
              options: {
                createMany: {
                  data: data.poll.options.map((option) => ({
                    title: option,
                  })),
                },
              },
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          }),
        ]);
      } else if (type === "OFFER") {
        if (!data.offer) {
          throw new Error("INVALID_DATA");
        }

        await ctx.db.$transaction([
          ctx.db.activity.create({
            data: {
              id,
              type,
            },
          }),
          ctx.db.offer.create({
            data: {
              id,
              title: data.offer.title,
              description: data.offer.description,
              price: data.offer.price,
              condition: data.offer.condition,
              image: data.offer.image,
              category: data.offer.category,
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          }),
        ]);

        return {
          id,
        };
      } else if (type === "EVENT") {
        if (!data.event) {
          throw new Error("INVALID_DATA");
        }

        await ctx.db.$transaction([
          ctx.db.activity.create({
            data: {
              id,
              type,
            },
          }),
          ctx.db.event.create({
            data: {
              id,
              title: data.event.title,
              description: data.event.description,
              from: data.event.from,
              to: data.event.to,
              location: data.event.location,
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          }),
        ]);
      } else if (type === "POST") {
        if (!data.post) {
          throw new Error("INVALID_DATA");
        }

        await ctx.db.$transaction([
          ctx.db.activity.create({
            data: {
              id,
              type,
            },
          }),
          ctx.db.post.create({
            data: {
              id,
              title: data.post.title,
              content: data.post.content,
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          }),
        ]);
      } else if (type === "RADIO_SUBMISSION") {
        if (!data.radio_submission) {
          throw new Error("INVALID_DATA");
        }

        await ctx.db.$transaction([
          ctx.db.activity.create({
            data: {
              id,
              type,
            },
          }),
          ctx.db.radioSubmission.create({
            data: {
              id,
              title: data.radio_submission.title,
              content: data.radio_submission.content,
              link: data.radio_submission.link,
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          }),
        ]);
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid type",
        });
      }

      return {
        id,
      };
    }),
});
