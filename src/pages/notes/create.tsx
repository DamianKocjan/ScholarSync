import { useDropzone } from "@uploadthing/react/hooks";
import {
  AlertCircle,
  FileAudio,
  FileVideo2,
  FolderDown,
  ImagePlus,
  LucideGripVertical,
  LucideTrash2,
  LucideX,
} from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { LargeText, MutedText, Paragraph } from "~/components/ui/typography";
import { useForm } from "~/hooks/use-form";
import { createNoteSchema } from "~/schemas/note";
import { api } from "~/utils/api";
import { useUploadThing } from "~/utils/uploadthing";

const ItemTypes = {
  SECTION: "SECTION",
};

export default function NoteCreate() {
  const router = useRouter();
  const form = useForm({
    schema: createNoteSchema,
    defaultValues: {
      title: "",
      description: "",
      sections: [
        {
          type: "TEXT",
          index: 0,
          subtitle: "",
          content: "",
        },
      ],
    },
  });
  const sections = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const appendSectionToNote = () => {
    sections.append({
      type: "TEXT",
      index: sections.fields.length,
      subtitle: "",
      content: "",
    });
  };

  const updateIndexes = () => {
    sections.fields.forEach((_field, index) => {
      form.setValue(`sections.${index}.index`, index);
    });
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    sections.move(fromIndex, toIndex);
    updateIndexes();
  };

  const removeSection = (index: number) => {
    if (sections.fields.length === 1) {
      return;
    }

    sections.remove(index);
    updateIndexes();
  };

  const { mutateAsync } = api.note.create.useMutation();

  const createNote = form.handleSubmit(async (values) => {
    try {
      const { id } = await mutateAsync(values);
      await router.push(`/notes/${id}`);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <Head>
        {/* TODO: SEO */}
        <title>Create note</title>
      </Head>
      <main className="flex flex-col items-center">
        <Form {...form}>
          <form onSubmit={createNote} className="w-2/3 space-y-6">
            {sections.fields.map((field, index) => {
              if (index === 0) {
                return (
                  <div className="flex space-x-6" key={field.id}>
                    <NoteDetails />
                    <div className="relative w-full">
                      <NoteSection
                        index={index}
                        isLast={index === sections.fields.length - 1}
                        handleAppendSection={appendSectionToNote}
                        handleMoveSection={moveSection}
                        handleRemoveSection={removeSection}
                      />
                    </div>
                  </div>
                );
              }
              return (
                <NoteSection
                  key={field.id}
                  index={index}
                  isLast={index === sections.fields.length - 1}
                  handleAppendSection={appendSectionToNote}
                  handleMoveSection={moveSection}
                  handleRemoveSection={removeSection}
                />
              );
            })}

            <Button type="submit" className="w-full">
              Create note
            </Button>
          </form>
        </Form>
      </main>
    </>
  );
}

function NoteDetails() {
  const { control } = useFormContext();

  return (
    <div className="w-1/3 space-y-6 border-r pr-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Note title" {...field} />
            </FormControl>
            <FormDescription>This is your note title.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Textarea placeholder="Note description" {...field} />
            </FormControl>
            <FormDescription>
              This is your note description. It should be short and concise.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

type NoteSectionProps = {
  index: number;
  isLast: boolean;
  handleAppendSection: () => void;
  handleMoveSection: (from: number, to: number) => void;
  handleRemoveSection: (index: number) => void;
};

function NoteSection({
  index,
  isLast,
  handleAppendSection,
  handleMoveSection,
  handleRemoveSection,
}: NoteSectionProps) {
  const { control, watch } = useFormContext();

  const type = watch(`sections.${index}.type`) as
    | "TEXT"
    | "IMAGE"
    | "VIDEO"
    | "AUDIO"
    | "FILE"
    | "QUIZ";

  const [{ isDragging }, ref, preview] = useDrag({
    type: ItemTypes.SECTION,
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.SECTION,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        handleMoveSection(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <>
      <div
        className="relative space-y-6"
        ref={(node) => preview(drop(node))}
        style={{
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        <div className="flex items-center justify-between pt-6">
          <FormField
            control={control}
            name={`sections.${index}.type`}
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Section type</FormLabel> */}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? "TEXT"}
                >
                  <FormControl>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select type of section" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TEXT">Text</SelectItem>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                    <SelectItem value="IMAGE">Image</SelectItem>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="AUDIO">Audio</SelectItem>
                    <SelectItem value="FILE">File</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveSection(index)}
            >
              <LucideTrash2 className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="cursor-move"
              ref={ref}
            >
              <LucideGripVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <FormField
          control={control}
          name={`sections.${index}.subtitle`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="Note subtitle" {...field} />
              </FormControl>
              <FormDescription>
                Section subtitle. It should be short and explanatory of the
                content of the section.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`sections.${index}.content`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Note content" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === "AUDIO" ? (
          <AudioSectionForm index={index} />
        ) : type === "FILE" ? (
          <FileSectionForm index={index} />
        ) : type === "IMAGE" ? (
          <ImageSectionForm index={index} />
        ) : type === "QUIZ" ? (
          <QuizSectionForm index={index} />
        ) : type === "VIDEO" ? (
          <VideoSectionForm index={index} />
        ) : null}
      </div>

      {isLast ? (
        <Button
          type="button"
          className="my-6 w-full"
          onClick={handleAppendSection}
        >
          <span>Add section</span>
        </Button>
      ) : null}
    </>
  );
}

function useUpload(index: number) {
  const { setValue } = useFormContext();
  const [error, setError] = useState<{ name: string; message: string }>();

  const { startUpload, isUploading } = useUploadThing("noteFileUploader", {
    onClientUploadComplete: (res) => {
      if (!res?.[0]) {
        return;
      }

      setValue(`sections.${index}.file`, res[0].url);
    },
    onUploadError: (e) => {
      setError({
        name: e.name,
        message: e.message,
      });
    },
  });

  return {
    startUpload,
    isUploading,
    error,
  };
}

type AudioSectionFormProps = {
  index: number;
};

function AudioSectionForm({ index }: AudioSectionFormProps) {
  const { getValues } = useFormContext();
  const { startUpload, isUploading, error } = useUpload(index);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    void startUpload([file]);
    setFile(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "audio/mp3": [".mp3"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 16 * 1024 * 1024, // 16MB
  });

  const retryUpload = async () => {
    if (!file) {
      return;
    }

    await startUpload([file]);
  };

  return (
    <div
      className="flex justify-center rounded-md border-2 border-dashed px-6 pb-6 pt-5"
      {...getRootProps()}
    >
      <div className="space-y-1 text-center">
        {file ? (
          error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{error.name}</AlertTitle>
              <AlertDescription>
                {error.message}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={retryUpload}
                  className="ml-2"
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <audio
              controls
              className="mx-auto mb-4 h-auto max-h-[600px] w-full"
            >
              <source
                type="audio/mp3"
                src={getValues(`sections.${index}.file`)}
              />
              Your browser does not support the audio element.
            </audio>
          )
        ) : (
          <FileAudio className="mx-auto h-12 w-12" strokeWidth="1" />
        )}
        <Paragraph className="flex items-center">
          <FormLabel htmlFor="audio">
            <span className="text-primary">Upload a audio &nbsp;</span>
            <input
              id="audio"
              name="audio"
              type="file"
              className="sr-only"
              required
              {...getInputProps()}
              disabled={isUploading}
            />
          </FormLabel>
          <span>or drag and drop</span>
        </Paragraph>
        <MutedText>MP3 up to 16MB</MutedText>
      </div>
    </div>
  );
}

type FileSectionFormProps = {
  index: number;
};

function FileSectionForm({ index }: FileSectionFormProps) {
  const { getValues } = useFormContext();
  const { startUpload, isUploading, error } = useUpload(index);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    void startUpload([file]);
    setFile(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/*": [".*"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 32 * 1024 * 1024, // 32MB
  });

  const retryUpload = async () => {
    if (!file) {
      return;
    }

    await startUpload([file]);
  };

  return (
    <div
      className="flex justify-center rounded-md border-2 border-dashed px-6 pb-6 pt-5"
      {...getRootProps()}
    >
      <div className="space-y-1 text-center">
        {file ? (
          error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{error.name}</AlertTitle>
              <AlertDescription>
                {error.message}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={retryUpload}
                  className="ml-2"
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <LargeText className="text-primary">
              <a href={getValues(`sections.${index}.file`)} download>
                {file.name}
              </a>
            </LargeText>
          )
        ) : (
          <FolderDown className="mx-auto h-12 w-12" strokeWidth="1" />
        )}
        <Paragraph className="flex items-center">
          <FormLabel htmlFor="file">
            <span className="text-primary">Upload a file &nbsp;</span>
            <input
              id="file"
              name="file"
              type="file"
              className="sr-only"
              required
              {...getInputProps()}
              disabled={isUploading}
            />
          </FormLabel>
          <span>or drag and drop</span>
        </Paragraph>
        <MutedText>Any file up to 32MB</MutedText>
      </div>
    </div>
  );
}

type PreviewThumbnail = FileReader["result"];

function useThumbnail(handleDrop: (file: File) => Promise<void> | void) {
  const [thumbnail, setThumbnail] = useState<File>();
  const [previewThumbnail, setPreviewThumbnail] =
    useState<PreviewThumbnail>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    setThumbnail(file);

    // create preview image of thumbnail
    const reader = new FileReader();
    reader.onload = (e) => {
      e.target && setPreviewThumbnail(e.target.result);
    };
    reader.readAsDataURL(new Blob([file], { type: file.type }));

    void handleDrop(file);
  };

  const handleRemoveThumbnail = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewThumbnail(null);
    setThumbnail(undefined);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/gif": [".gif"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 16 * 1024 * 1024, // 16MB
  });

  return {
    thumbnail,
    previewThumbnail,
    getRootProps,
    getInputProps,
    handleRemoveThumbnail,
  };
}

type ImageSectionFormProps = {
  index: number;
};

function ImageSectionForm({ index }: ImageSectionFormProps) {
  const { setValue } = useFormContext();
  const { error, isUploading, startUpload } = useUpload(index);

  const handleUploadImage = async (file: File) => {
    const result = await startUpload([file]);

    if (!result?.[0]) {
      return;
    }
    setValue(`sections.${index}.file`, result[0].url);
  };

  const { thumbnail, previewThumbnail, getRootProps, getInputProps } =
    useThumbnail(handleUploadImage);

  const retryUpload = async () => {
    if (!thumbnail) {
      return;
    }

    await handleUploadImage(thumbnail);
  };

  return (
    <div
      className="flex justify-center rounded-md border-2 border-dashed px-6 pb-6 pt-5"
      {...getRootProps()}
    >
      <div className="space-y-1 text-center">
        {previewThumbnail ? (
          error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{error.name}</AlertTitle>
              <AlertDescription>
                {error.message}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={retryUpload}
                  className="ml-2"
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <img
              src={previewThumbnail.toString()}
              className="my-auto max-h-72 w-auto rounded-lg"
              alt="Preview"
            />
          )
        ) : (
          <ImagePlus className="mx-auto h-12 w-12" strokeWidth="1" />
        )}
        <Paragraph className="flex items-center">
          <FormLabel htmlFor="image">
            <span className="text-primary">Upload a image &nbsp;</span>
            <input
              id="image"
              name="image"
              type="file"
              className="sr-only"
              required
              {...getInputProps()}
              disabled={isUploading}
            />
          </FormLabel>
          <span>or drag and drop</span>
        </Paragraph>
        <MutedText>PNG, JPG, GIF up to 16MB</MutedText>
      </div>
    </div>
  );
}

type QuizSectionFormProps = {
  index: number;
};

function QuizSectionForm({ index }: QuizSectionFormProps) {
  const { control } = useFormContext();
  const options = useFieldArray({
    control: control,
    name: `sections.${index}.quizAnswers`,
  });

  console.log(options.fields);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        {options.fields.map((field, optionIndex) => (
          <div className="space-y-6" key={field.id}>
            <div className="flex items-center space-x-6">
              <FormField
                control={control}
                name={`sections.${index}.quizAnswers.${optionIndex}.answer`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Input placeholder="Answer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => options.remove(optionIndex)}
              >
                <LucideX className="h-4 w-4" />
              </Button>
            </div>

            <FormField
              control={control}
              name={`sections.${index}.quizAnswers.${optionIndex}.isCorrect`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is correct</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          className="my-6 w-full"
          onClick={() =>
            options.append({
              answer: "",
              isCorrect: false,
            })
          }
        >
          Add option
        </Button>
      </CardContent>
    </Card>
  );
}

type VideoSectionFormProps = {
  index: number;
};

function VideoSectionForm({ index }: VideoSectionFormProps) {
  const { getValues } = useFormContext();
  const { startUpload, isUploading, error } = useUpload(index);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    void startUpload([file]);
    setFile(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 32 * 1024 * 1024, // 32MB
  });

  const retryUpload = async () => {
    if (!file) {
      return;
    }

    await startUpload([file]);
  };

  return (
    <div
      className="flex justify-center rounded-md border-2 border-dashed px-6 pb-6 pt-5"
      {...getRootProps()}
    >
      <div className="space-y-1 text-center">
        {file ? (
          error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{error.name}</AlertTitle>
              <AlertDescription>
                {error.message}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={retryUpload}
                  className="ml-2"
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <video
              controls
              className="mx-auto mb-4 h-auto max-h-[600px] w-full"
            >
              <source
                type="video/mp4"
                src={getValues(`sections.${index}.file`)}
              />
              Your browser does not support the video element.
            </video>
          )
        ) : (
          <FileVideo2 className="mx-auto h-12 w-12" strokeWidth="1" />
        )}
        <Paragraph className="flex items-center">
          <FormLabel htmlFor="video">
            <span className="text-primary">Upload a video &nbsp;</span>
            <input
              id="video"
              name="video"
              type="file"
              className="sr-only"
              required
              {...getInputProps()}
              disabled={isUploading}
            />
          </FormLabel>
          <span>or drag and drop</span>
        </Paragraph>
        <MutedText>MP4 up to 32MB</MutedText>
      </div>
    </div>
  );
}
