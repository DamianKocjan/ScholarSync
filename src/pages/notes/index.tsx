import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";

import { Avatar } from "~/components/avatar";
import { Error } from "~/components/error";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { H1, H3, MutedText } from "~/components/ui/typography";
import { api } from "~/utils/api";

export default function Notes() {
  useSession({ required: true });

  return (
    <>
      <NextSeo title="Notes" />

      <main className="mx-auto flex flex-col items-center space-y-6 sm:w-2/3">
        <div className="flex w-full items-center justify-between space-y-2">
          <H1>Notes</H1>
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
              <Link href="/notes/create">Create note</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full space-y-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="my">My</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4 divide-y-2">
            <AllNotes />
          </TabsContent>
          <TabsContent value="my" className="space-y-4 divide-y-2">
            <MyNotes />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

function MyNotes() {
  const { data, isError, isLoading, error } = api.note.myAll.useQuery();

  if (isLoading) {
    return Array.from({ length: 10 }).map((_, i) => (
      <div key={`note-loading-skeleton-${i}`}>
        <Skeleton className="h-4" />
      </div>
    ));
  } else if (isError) {
    return <Error title="Error" description={error?.message} />;
  }
  return data.map((note) => (
    <div key={note.id}>
      <Link href={`/notes/${note.id}`} className="flex items-center space-x-4">
        <Avatar name={note.user.name} image={note.user.image} />

        <div>
          <H3>{note.title}</H3>
          <MutedText>{note.description}</MutedText>
        </div>

        <div className="flex-1">
          <MutedText className="text-right">
            {new Date(note.createdAt).toLocaleDateString()}
          </MutedText>
        </div>
      </Link>
    </div>
  ));
}

function AllNotes() {
  const { data, isError, isLoading, error } = api.note.getAll.useQuery();

  if (isLoading) {
    return Array.from({ length: 10 }).map((_, i) => (
      <div key={`note-loading-skeleton-${i}`}>
        <Skeleton className="h-4" />
      </div>
    ));
  } else if (isError) {
    return <Error title="Error" description={error?.message} />;
  }
  return data.map((note) => (
    <div key={note.id}>
      <Link href={`/notes/${note.id}`} className="flex items-center space-x-4">
        <Avatar name={note.user.name} image={note.user.image} />

        <div>
          <H3>{note.title}</H3>
          <MutedText>{note.description}</MutedText>
        </div>

        <div className="flex-1">
          <MutedText className="text-right">
            {new Date(note.createdAt).toLocaleDateString()}
          </MutedText>
        </div>
      </Link>
    </div>
  ));
}
