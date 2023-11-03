import { useDropzone } from "@uploadthing/react/hooks";
import { AlertCircle, ImagePlus } from "lucide-react";
import { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { FormLabel } from "~/components/ui/form";
import { MutedText, Paragraph } from "~/components/ui/typography";
import { useNotesUpload } from "~/hooks/use-notes-upload";

type ImageSectionFormProps = {
  index: number;
};

export function ImageSectionForm({ index }: ImageSectionFormProps) {
  const { setValue } = useFormContext();
  const { error, isUploading, startUpload } = useNotesUpload(index);

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
