import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";

import { Feed } from "~/components/spotted/feed";

export default function Home() {
  useSession({ required: true });

  return (
    <>
      <NextSeo title="Spotted" />

      <main className="mx-auto flex flex-col items-center space-y-6 sm:w-2/3">
        <Feed withCreate />
      </main>
    </>
  );
}
