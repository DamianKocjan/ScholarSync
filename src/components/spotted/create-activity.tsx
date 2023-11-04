import { LucideX } from "lucide-react";
import { useSession } from "next-auth/react";
import { useFieldArray, useFormContext } from "react-hook-form";
import z from "zod";

import { useRouter } from "next/router";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { SmallText } from "~/components/ui/typography";
import { useForm } from "~/hooks/use-form";
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
                    <FormControl>
                      <Select {...field}>
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
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardHeader>

          <CardContent>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Post title" {...field} />
                  </FormControl>
                  <FormDescription>This is your post title.</FormDescription>
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
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="What's on your mind?"
              ></Textarea>
            </FormControl>
            <FormDescription>This is your post description</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex w-full flex-row justify-between">
        <div className="w-full">
          <FormField
            control={control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Calendar
                    {...field}
                    mode="single"
                    className="w-min rounded-md border bg-gray-200"
                  />
                </FormControl>
                <FormDescription>Select start date of event</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full">
          <FormField
            control={control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Calendar
                    {...field}
                    mode="single"
                    className="w-min rounded-md border bg-gray-200"
                  />
                </FormControl>
                <FormDescription>Select end date of event</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Where are we going?"></Input>
            </FormControl>
            <FormDescription>This is location of event</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function ActivityOfferForm() {
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Money, money, money"></Input>
            </FormControl>
            <FormDescription>Set price of this item</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. 'automotive'"></Input>
            </FormControl>
            <FormDescription>Set category</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Condition</FormLabel>
            <FormControl>
              <Select {...field}>
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
            <FormDescription>Set condition</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image</FormLabel>
            <FormControl>
              <Input {...field}></Input>
            </FormControl>
            <FormDescription>Send pic plz</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
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
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="What's on your mind?"
              ></Textarea>
            </FormControl>
            <FormDescription>This is your post description</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {options.fields.map((field, optionIndex) => (
        <div className="space-y-6" key={field.id}>
          <div className="flex items-center space-x-6">
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
        className="my-6 w-[20%]"
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
            <Textarea {...field} placeholder="What's on your mind?"></Textarea>
          </FormControl>
          <FormDescription>This is your post description</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
