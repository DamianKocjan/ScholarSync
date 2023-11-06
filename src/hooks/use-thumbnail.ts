import { useDropzone } from "@uploadthing/react/hooks";
import { useCallback, useState } from "react";

type PreviewThumbnail = FileReader["result"];

export function useThumbnail(handleDrop: (file: File) => Promise<void> | void) {
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
