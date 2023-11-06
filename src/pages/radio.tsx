import { AlertCircle, Info, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { z } from "zod";

import { Activity } from "~/components/spotted/activity";
import { ActivityRadioSubmissionForm } from "~/components/spotted/create-activity";
import { InfiniteLoader } from "~/components/spotted/infinite-loader";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { H1, SmallText } from "~/components/ui/typography";
import { useForm } from "~/hooks/use-form";
import { api } from "~/utils/api";

export default function SchoolRadio() {
  useSession({ required: true });

  return (
    <>
      <NextSeo title="Marketplace" />
      <main className="mx-auto flex w-2/3 flex-col items-center space-y-6">
        <div className="flex items-center justify-between">
          <H1>School Radio</H1>
        </div>

        <CreateRadioSubmission />
        <Feed />
      </main>
    </>
  );
}

function Feed() {
  const limit = 14;
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    isFetching,
  } = api.feed.getAll.useInfiniteQuery(
    {
      limit,
      type: "RADIO_SUBMISSION",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <div className="flex flex-col space-y-6">
      {isLoading ? (
        <div className="flex items-center text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      ) : data?.pages?.[0]?.items.length === 0 ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No submissions yet</AlertTitle>
          <AlertDescription>
            Seems like there are no radio submissions yet.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {data?.pages.map((page) =>
            page.items.map((item) => (
              // @ts-expect-error this is fine
              <Activity key={item.id} {...item} type="RADIO_SUBMISSION" />
            )),
          )}
          <InfiniteLoader
            callback={() => fetchNextPage()}
            isFetching={isFetching}
            hasNextPage={hasNextPage ?? false}
          />
        </>
      )}
    </div>
  );
}

const createActivityRadioSubmissionSchema = z.object({
  title: z.string(),
  content: z.string(),
  link: z.union([
    z.string().startsWith("https://www.youtube.com/watch?v=", {
      message: "Invalid link",
    }),
    z.string().startsWith("https://youtu.be/", {
      message: "Invalid link",
    }),
    z.string().startsWith("https://open.spotify.com/track/", {
      message: "Invalid link",
    }),
  ]),
});

function CreateRadioSubmission() {
  const { data: sessionData } = useSession();
  const form = useForm({
    schema: createActivityRadioSubmissionSchema,
  });
  const router = useRouter();
  const { mutateAsync: createActivity } = api.feed.create.useMutation({
    async onSuccess(data) {
      await router.push(`/spotted/${data.id}`);
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await createActivity({
      type: "RADIO_SUBMISSION",
      data: {
        radio_submission: {
          title: values.title,
          content: values.content,
          link: values.link,
        },
      },
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <Card className="min-w-[40rem] max-w-xl p-2">
          <CardHeader>
            <div className="flex-column flex items-center justify-between gap-2">
              <div className="flex-column flex items-center">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={sessionData?.user.image ?? ""}
                    alt={sessionData?.user.name ?? "??"}
                  />
                  <AvatarFallback>
                    {sessionData?.user.name
                      ? sessionData.user.name?.charAt(0).toUpperCase() +
                        sessionData.user.name?.charAt(1).toUpperCase()
                      : "??"}
                  </AvatarFallback>
                </Avatar>
                <SmallText className="p-2">
                  {sessionData?.user.name ?? "Anonymous"}
                </SmallText>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ActivityRadioSubmissionForm />
          </CardContent>

          <CardFooter>
            <Button variant="default" type="submit" className="w-full">
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
