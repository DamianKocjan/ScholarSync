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

export const basicNoteSection = z.object({
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
export type BasicNoteSection = z.infer<typeof basicNoteSection>;

export const imageNoteSection = z.object({
  type: z.literal("IMAGE", {
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
  file: z.string().url("Invalid file URL."),
});
export type ImageNoteSection = z.infer<typeof imageNoteSection>;

export const videoNoteSection = z.object({
  type: z.literal("VIDEO", {
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
  file: z.string().url("Invalid file URL."),
});
export type VideoNoteSection = z.infer<typeof videoNoteSection>;

export const audioNoteSection = z.object({
  type: z.literal("AUDIO", {
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
  file: z.string().url("Invalid file URL."),
});
export type AudioNoteSection = z.infer<typeof audioNoteSection>;

export const fileNoteSection = z.object({
  type: z.literal("FILE", {
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
  file: z.string().url("Invalid file URL."),
});
export type FileNoteSection = z.infer<typeof fileNoteSection>;

export const quizNoteSection = z.object({
  type: z.literal("QUIZ", {
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
    .array(
      z.union([
        basicNoteSection,
        imageNoteSection,
        videoNoteSection,
        audioNoteSection,
        fileNoteSection,
        quizNoteSection,
      ]),
    )
    .min(1, "Must have at least 1 section.")
    .max(25, "Must have at most 25 sections."),
});
