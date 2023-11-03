import { useDropzone } from "@uploadthing/react/hooks";
import { AlertCircle, FileVideo2 } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { FormLabel } from "~/components/ui/form";
import { MutedText, Paragraph } from "~/components/ui/typography";
import { useNotesUpload } from "~/hooks/use-notes-upload";

type VideoSectionFormProps = {
  index: number;
};

export function VideoSectionForm({ index }: VideoSectionFormProps) {
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
