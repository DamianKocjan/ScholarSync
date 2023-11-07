import { AlertCircle, Info, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

import { Activity } from "~/components/spotted/activity";
import { ActivityOfferForm } from "~/components/spotted/create-activity";
import { InfiniteLoader } from "~/components/spotted/infinite-loader";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { H1, SmallText } from "~/components/ui/typography";
import { useForm } from "~/hooks/use-form";
import { api } from "~/utils/api";

const filtersSchema = z.object({
  title: z.string().optional(),
  condition: z.enum(["NEW", "USED", "UNKNOWN"]).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  category: z.string().optional(),
});

type Filters = z.infer<typeof filtersSchema>;

export default function Marketplace() {
  useSession({ required: true });

  const form = useForm({
    schema: filtersSchema,
  });

  const [filters, setFilters] = useState<Filters>({
    title: undefined,
    condition: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    category: undefined,
  });

  const handleSubmit = form.handleSubmit((data) => {
    setFilters(data);
  });

  return (
    <>
      <NextSeo title="Marketplace" />
      <main className="mx-auto flex w-2/3 flex-col items-center space-y-6">
        <div className="flex items-center justify-between">
          <H1>Marketplace</H1>
        </div>

        <CreateOffer />
        <Form {...form}>
          <Filter handleSubmit={handleSubmit} />
        </Form>
        <Feed filters={filters} />
      </main>
    </>
  );
}

const conditionTypes = ["NEW", "USED", "UNKNOWN"];

interface FilterProps {
  handleSubmit: () => void;
}

function Filter({ handleSubmit }: FilterProps) {
  const { control } = useFormContext();

  return (
    <form onSubmit={handleSubmit}>
      <Card className="min-w-[40rem] max-w-xl p-2">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product name</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={control}
              name="minPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      pattern="^\d*(\.\d{0,2})?$"
                      placeholder="Min price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="maxPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      pattern="^\d*(\.\d{0,2})?$"
                      placeholder="Max price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {conditionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </CardContent>

        <CardFooter>
          <Button variant="default" type="submit" className="w-full">
            Filter
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

interface FeedProps {
  filters?: {
    title?: string;
    condition?: "NEW" | "USED" | "UNKNOWN";
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  };
}

export const Feed: React.FC<FeedProps> = ({ filters }) => {
  const limit = 14;
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = api.offer.getAll.useInfiniteQuery(
    {
      limit,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filters,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    void refetch();
  }, [filters, refetch]);

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
          <AlertTitle>No offers yet</AlertTitle>
          <AlertDescription>
            Seems like there are no offers yet.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {data?.pages.map((page) =>
            page.items.map((item) => (
              // @ts-expect-error this is fine
              <Activity key={item.id} {...item} type="OFFER" />
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
};

const createActivityOfferSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  condition: z.enum(["NEW", "USED", "UNKNOWN"]),
  image: z.string(),
});

function CreateOffer() {
  const { data: sessionData } = useSession();
  const form = useForm({
    schema: createActivityOfferSchema,
  });
  const router = useRouter();
  const { mutateAsync: createActivity, isLoading } =
    api.feed.create.useMutation({
      async onSuccess(data) {
        await router.push(`/spotted/${data.id}`);
      },
    });

  const handleSubmit = form.handleSubmit(async (values) => {
    await createActivity({
      type: "OFFER",
      data: {
        offer: {
          title: values.title,
          description: values.description,
          price: values.price,
          category: values.category,
          condition: values.condition,
          image: values.image,
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

            <ActivityOfferForm />
          </CardContent>

          <CardFooter>
            <Button
              variant="default"
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4" /> : null}
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
