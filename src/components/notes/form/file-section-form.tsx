import { useDropzone } from "@uploadthing/react/hooks";
import { AlertCircle, FolderDown } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { FormLabel } from "~/components/ui/form";
import { LargeText, MutedText, Paragraph } from "~/components/ui/typography";
import { useNotesUpload } from "~/hooks/use-notes-upload";

type FileSectionFormProps = {
  index: number;
};

export function FileSectionForm({ index }: FileSectionFormProps) {
  const { getValues } = useFormContext();
  const { startUpload, isUploading, error } = useNotesUpload(index);
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
