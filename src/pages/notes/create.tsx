import Head from "next/head";
import { useRouter } from "next/router";
import { useFieldArray } from "react-hook-form";

import { NoteDetails } from "~/components/notes/form/note-detail";
import { NoteSection } from "~/components/notes/form/note-section";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { useForm } from "~/hooks/use-form";
import { createNoteSchema } from "~/schemas/note";
import { api } from "~/utils/api";

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
    form.getValues("sections").forEach((_section, index) => {
      form.setValue(`sections.${index}.index`, index);
    });
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    sections.move(fromIndex, toIndex);
    updateIndexes();
  };

  const removeSection = (index: number) => {
    if (form.getValues("sections").length === 1) {
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
