import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createNoteSchema, noteWithIdSchema } from "~/schemas/note";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createNoteSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { title, description, sections } = input;
        const { user } = ctx.session;

        const note = await ctx.db.note.create({
          data: {
            title,
            description,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
          select: {
            id: true,
          },
        });

        const updatedIndexSections = sections.map((section, index) => ({
          ...section,
          index,
        }));

        await ctx.db.$transaction(
          updatedIndexSections.map((section) =>
            section.type === "QUIZ" && "quizAnswers" in section
              ? ctx.db.noteSection.create({
                  data: {
                    ...section,
                    note: {
                      connect: {
                        id: note.id,
                      },
                    },
                    quizAnswers: {
                      createMany: {
                        data: section.quizAnswers,
                      },
                    },
                  },
                })
              : ctx.db.noteSection.create({
                  data: {
                    ...section,
                    note: {
                      connect: {
                        id: note.id,
                      },
                    },
                  },
                }),
          ),
        );

        return note;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error creating note",
        });
      }
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;

        const note = await ctx.db.note.findFirst({
          where: {
            id,
          },
          select: {
            id: true,
            title: true,
            description: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            sections: {
              select: {
                id: true,
                type: true,
                subtitle: true,
                content: true,
                file: true,
                index: true,
                quizAnswers: {
                  select: {
                    id: true,
                    answer: true,
                    isCorrect: true,
                  },
                },
                createdAt: true,
                updatedAt: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!note) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Note not found",
          });
        }

        return note;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error occurred while retrieving note",
        });
      }
    }),
  myAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { user } = ctx.session;

      return await ctx.db.note.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          title: true,
          description: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Error occurred while retrieving notes",
      });
    }
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.note.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Error occurred while retrieving notes",
      });
    }
  }),
  update: protectedProcedure
    .input(noteWithIdSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, title, description } = input;
        const { user } = ctx.session;

        const note = await ctx.db.note.findFirst({
          where: {
            id,
            userId: user.id,
          },
        });

        if (!note) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Note not found",
          });
        }

        return await ctx.db.note.update({
          where: {
            id,
          },
          data: {
            title,
            description,
          },
        });
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error updating note",
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = input;
        const { user } = ctx.session;

        const note = await ctx.db.note.findFirst({
          where: {
            id,
            userId: user.id,
          },
        });

        if (!note) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Note not found",
          });
        }

        return await ctx.db.note.delete({
          where: {
            id,
          },
        });
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error deleting note",
        });
      }
    }),
});
