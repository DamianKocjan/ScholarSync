import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { H1, H3, MutedText } from "~/components/ui/typography";
import { api } from "~/utils/api";

export default function Notes() {
  return (
    <main className="flex flex-col items-center">
      <div className="w-2/3 space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <H1>Notes</H1>
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
              <Link href="/notes/create">Create note</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="my">My</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4 divide-y-2">
            <MyNotes />
          </TabsContent>
          <TabsContent value="my" className="space-y-4 divide-y-2">
            <AllNotes />
          </TabsContent>
        </Tabs>
      </div>
    </main>
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
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error?.message}</AlertDescription>
      </Alert>
    );
  }
  return data.map((note) => (
    <div key={note.id}>
      <Link href={`/notes/${note.id}`} className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={note.user.image ?? undefined}
            alt={note.user.name ?? undefined}
          />
          <AvatarFallback>
            {note.user.name
              ? note.user.name?.charAt(0).toUpperCase() +
                note.user.name?.charAt(1).toUpperCase()
              : "??"}
          </AvatarFallback>
        </Avatar>

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
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error?.message}</AlertDescription>
      </Alert>
    );
  }
  return data.map((note) => (
    <div key={note.id}>
      <Link href={`/notes/${note.id}`} className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={note.user.image ?? undefined}
            alt={note.user.name ?? undefined}
          />
          <AvatarFallback>
            {note.user.name
              ? note.user.name?.charAt(0).toUpperCase() +
                note.user.name?.charAt(1).toUpperCase()
              : "??"}
          </AvatarFallback>
        </Avatar>

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
