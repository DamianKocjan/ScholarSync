import { LucideGripVertical, LucideTrash2 } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import { useFormContext } from "react-hook-form";

import { ContentField } from "~/components/notes/form/content-field";
import { Button } from "~/components/ui/button";
import {
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
import { AudioSectionForm } from "./audio-section-form";
import { FileSectionForm } from "./file-section-form";
import { ImageSectionForm } from "./image-section-form";
import { QuizSectionForm } from "./quiz-section-form";
import { VideoSectionForm } from "./video-section-form";

const ItemTypes = {
  SECTION: "SECTION",
};

type NoteSectionProps = {
  index: number;
  isLast: boolean;
  handleAppendSection: () => void;
  handleMoveSection: (from: number, to: number) => void;
  handleRemoveSection: (index: number) => void;
};

export function NoteSection({
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
        className="relative w-full space-y-6"
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

        <ContentField index={index} />

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
