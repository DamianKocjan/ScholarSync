import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { useUploadThing } from "~/utils/uploadthing";

export function useNotesUpload(index: number) {
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
