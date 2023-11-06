import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";

import { Feed } from "~/components/spotted/feed";

export default function Home() {
  useSession({ required: true });

  return (
    <>
      <NextSeo title="Spotted" />

      <main className="flex flex-col items-center">
        <Feed withCreate />
      </main>
    </>
  );
}
