import { generateReactHelpers } from "@uploadthing/react/hooks";

import { type OurFileRouter } from "~/server/uploadthing";

const { uploadFiles, useUploadThing } = generateReactHelpers<OurFileRouter>();

export { uploadFiles, useUploadThing };
