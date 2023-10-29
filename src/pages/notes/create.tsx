import { LucideGripVertical, LucideTrash2 } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDrag, useDrop } from "react-dnd";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "~/components/ui/button";
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
import { useForm } from "~/hooks/use-form";
import { createNoteSchema } from "~/schemas/note";
import { api } from "~/utils/api";

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
  const { control } = useFormContext();

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
                  defaultValue={field.value}
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
