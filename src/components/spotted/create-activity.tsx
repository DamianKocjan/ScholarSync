import { format } from "date-fns";
import { AlertCircle, CalendarIcon, ImagePlus, LucideX } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useFieldArray, useFormContext } from "react-hook-form";
import z from "zod";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { MutedText, Paragraph, SmallText } from "~/components/ui/typography";
import { useActivityUpload } from "~/hooks/use-activity-upload";
import { useForm } from "~/hooks/use-form";
import { useThumbnail } from "~/hooks/use-thumbnail";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

const createActivitySchema = z.union([
  z.object({
    type: z.literal("EVENT"),
    title: z.string(),
    description: z.string(),
    from: z.string(),
    to: z.string(),
    location: z.string(),
  }),
  z.object({
    type: z.literal("OFFER"),
    title: z.string(),
    description: z.string(),
    price: z.number(),
    category: z.string(),
    condition: z.enum(["NEW", "USED", "UNKNOWN"]),
    image: z.string(),
  }),
  z.object({
    type: z.literal("POLL"),
    title: z.string(),
    description: z.string(),
    options: z.array(z.object({ value: z.string() })),
  }),
  z.object({ type: z.literal("POST"), title: z.string(), content: z.string() }),
]);

export function CreateActivity() {
  const { data: sessionData } = useSession();
  const form = useForm({
    schema: createActivitySchema,
    defaultValues: {
      type: "POST",
      title: "",
      content: "",
    },
  });
  const router = useRouter();

  const activityType = form.watch("type");
  const { mutateAsync: createActivity } = api.feed.create.useMutation({
    async onSuccess(data) {
      await router.push(`/spotted/${data.id}`);
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    switch (values.type) {
      case "POST":
        await createActivity({
          type: "POST",
          data: {
            post: {
              title: values.title,
              content: values.content,
            },
          },
        });
        break;
      case "OFFER":
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
        break;
      case "EVENT":
        await createActivity({
          type: "EVENT",
          data: {
            event: {
              title: values.title,
              description: values.description,
              from: values.from,
              to: values.to,
              location: values.location,
            },
          },
        });
        break;
      case "POLL":
        await createActivity({
          type: "POLL",
          data: {
            poll: {
              title: values.title,
              description: values.description,
              options: values.options.map((option) => option.value),
            },
          },
        });
        break;
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <Card className="mb-5 flex h-fit w-fit min-w-[40rem] max-w-xl flex-col bg-slate-100 p-2">
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

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-40 bg-slate-100">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-100">
                        <SelectItem value="POST">Post</SelectItem>
                        <SelectItem value="OFFER">Offer</SelectItem>
                        <SelectItem value="EVENT">Event</SelectItem>
                        <SelectItem value="POLL">Poll</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
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

            {activityType === "POLL" ? (
              <ActivityPollForm />
            ) : activityType === "EVENT" ? (
              <ActivityEventForm />
            ) : activityType === "OFFER" ? (
              <ActivityOfferForm />
            ) : activityType === "POST" ? (
              <ActivityPostForm />
            ) : null}
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

function ActivityEventForm() {
  const { control, getValues } = useFormContext();
  const from = getValues("from");

  return (
    <>
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex space-x-6">
        <FormField
          control={control}
          name="from"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>From</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value as string), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value as string)}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormDescription>Select start date of event</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="to"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>End</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value as string), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value as string)}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    disabled={(date) =>
                      date < new Date() ||
                      date < new Date((from as string) ?? null)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormDescription>Select end date of event</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Where are we going?" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function ActivityOfferForm() {
  const { control } = useFormContext();
  const { error, isUploading, startUpload } = useActivityUpload();

  const handleUploadImage = async (file: File) => {
    await startUpload([file]);
  };

  const { thumbnail, previewThumbnail, getRootProps, getInputProps } =
    useThumbnail(handleUploadImage);

  const retryUpload = async () => {
    if (!thumbnail) {
      return;
    }

    await handleUploadImage(thumbnail);
  };

  return (
    <>
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="image"
        render={() => (
          <FormItem>
            <FormLabel>Image</FormLabel>
            <FormControl>
              <div
                className="flex justify-center rounded-md border-2 border-dashed px-6 pb-6 pt-5"
                {...getRootProps()}
              >
                <div className="space-y-1 text-center">
                  {previewThumbnail ? (
                    error ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{error.name}</AlertTitle>
                        <AlertDescription>
                          {error.message}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={retryUpload}
                            className="ml-2"
                          >
                            Retry
                          </Button>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <img
                        src={previewThumbnail.toString()}
                        className="my-auto max-h-72 w-auto rounded-lg"
                        alt="Preview"
                      />
                    )
                  ) : (
                    <ImagePlus className="mx-auto h-12 w-12" strokeWidth="1" />
                  )}
                  <Paragraph className="flex items-center">
                    <FormLabel htmlFor="image">
                      <span className="text-primary">
                        Upload a image &nbsp;
                      </span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                        required
                        {...getInputProps()}
                        disabled={isUploading}
                      />
                    </FormLabel>
                    <span>or drag and drop</span>
                  </Paragraph>
                  <MutedText>PNG, JPG, GIF up to 16MB</MutedText>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                type="number"
                inputMode="numeric"
                pattern="^\d*(\.\d{0,2})?$"
                min="0"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex space-x-6">
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Travel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="condition"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Condition</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="USED">Used</SelectItem>
                    <SelectItem value="UNKNOWN">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

function ActivityPollForm() {
  const { control } = useFormContext();
  const options = useFieldArray({
    control,
    name: "options",
  });

  return (
    <>
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {options.fields.map((field, optionIndex) => (
        <div className="space-y-6" key={field.id}>
          <div className="flex items-end space-x-6">
            <FormField
              control={control}
              name={`options.${optionIndex}.value`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Option {optionIndex + 1}</FormLabel>
                  <FormControl>
                    <Input placeholder="Option" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => options.remove(optionIndex)}
            >
              <LucideX className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="my-6 w-full"
        onClick={() =>
          options.append({
            value: "",
          })
        }
      >
        Add option
      </Button>
    </>
  );
}

function ActivityPostForm() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Content</FormLabel>
          <FormControl>
            <Textarea {...field} placeholder="What's on your mind?" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
