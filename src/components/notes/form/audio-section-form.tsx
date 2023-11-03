import { useDropzone } from "@uploadthing/react/hooks";
import { AlertCircle, FileAudio } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { FormLabel } from "~/components/ui/form";
import { MutedText, Paragraph } from "~/components/ui/typography";
import { useNotesUpload } from "~/hooks/use-notes-upload";

type AudioSectionFormProps = {
  index: number;
};

export function AudioSectionForm({ index }: AudioSectionFormProps) {
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
