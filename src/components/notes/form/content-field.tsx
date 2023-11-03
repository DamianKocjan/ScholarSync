import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import "react-quill/dist/quill.snow.css";

import { formats, modules } from "~/utils/quill";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type ContentFieldProps = {
  index: number;
};

export function ContentField({ index }: ContentFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={`sections.${index}.content`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Content</FormLabel>
          <FormControl>
            <ReactQuill
              theme="snow"
              {...field}
              onBlur={(_range, _sources, editor) => {
                field.onChange(editor.getHTML());
                field.onBlur();
              }}
              modules={modules}
              formats={formats}
            />
            {/* <Textarea placeholder="Note content" {...field} /> */}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
