import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

import { getServerAuthSession } from "./auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  noteFileUploader: f({
    image: { maxFileSize: "16MB" },
    audio: { maxFileSize: "16MB" },
    video: { maxFileSize: "32MB" },
    blob: { maxFileSize: "32MB" },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, res }) => {
      // This code runs on your server before upload
      const session = await getServerAuthSession({ req, res });

      // If you throw, the session will not be able to upload
      if (!session) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;