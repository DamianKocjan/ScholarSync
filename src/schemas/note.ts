import { z } from "zod";

export const noteSchema = z.object({
  title: z
    .string()
    .min(1, "Title must not be empty.")
    .max(250, "Title must not be longer than 250 characters."),
  description: z
    .string()
    .max(500, "Description must not be longer than 500 characters.")
    .optional(),
});

export const noteWithIdSchema = noteSchema.extend({
  id: z.string(),
});

export const noteSection = z.object({
  type: z.literal("TEXT", {
    invalid_type_error: "Invalid section type.",
  }),
  index: z
    .number()
    .min(0, "Index cannot be smaller than 0.")
    .max(24, "Index cannot be larger than 24."),
  subtitle: z
    .string()
    .max(250, "Subtitle must not be longer than 250 characters.")
    .optional(),
  content: z
    .string()
    .max(5000, "Description must not be longer than 5000 characters.")
    .optional(),
});
export type NoteSection = z.infer<typeof noteSection>;

export const fileishNoteSection = noteSection.extend({
  type: z.enum(["IMAGE", "VIDEO", "AUDIO", "FILE"], {
    invalid_type_error: "Invalid section type.",
  }),
  file: z.string().url("Invalid file URL."),
});
export type FileishNoteSection = z.infer<typeof fileishNoteSection>;

export const quizNoteSection = noteSection.extend({
  type: z.literal("QUIZ", {
    invalid_type_error: "Invalid section type.",
  }),
  quizAnswers: z
    .array(
      z.object({
        answer: z
          .string()
          .min(1, "Answer must not be empty.")
          .max(250, "Answer must not be longer than 250 characters."),
        isCorrect: z.boolean(),
      }),
    )
    .min(2, "Must have at least 2 answers.")
    .max(10, "Must have at most 10 answers."),
});
export type QuizNoteSection = z.infer<typeof quizNoteSection>;

export const createNoteSchema = noteSchema.extend({
  sections: z
    .array(z.union([noteSection, fileishNoteSection, quizNoteSection]))
    .min(1, "Must have at least 1 section.")
    .max(25, "Must have at most 25 sections."),
});
