import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { useFormatRelativeDate } from "~/hooks/use-format-relative-date";
import { api } from "~/utils/api";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Paragraph, SmallText } from "../ui/typography";
import { Comment } from "./comment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

// TODO: use `use-form` hook when it's gonna be merged into main
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm as _useForm,
  useFieldArray,
  type UseFormProps,
} from "react-hook-form";
import z, { array, type TypeOf, type ZodSchema } from "zod";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { LucideX } from "lucide-react";

type UseZodFormProps<T extends ZodSchema> = UseFormProps<TypeOf<T>> & {
  schema: T;
};

/** Wrapper of `react-hook-form` hook `useForm` with `zod` as validator */
function useForm<T extends ZodSchema>({
  schema,
  ...formConfig
}: UseZodFormProps<T>) {
  return _useForm({
    ...formConfig,
    resolver: zodResolver(schema),
  });
}
const CreatePostSchema = z.union([
  z.object({
    title: z.string(),
    description: z.string(),
    from: z.string(),
    to: z.string(),
    location: z.string(),
  }),
  z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    category: z.string(),
    condition: z.enum([
      //@ts-ignore
      z.literal("NEW"),
      z.literal("USED"),
      z.literal("UNKNOWN"),
    ]),
    image: z.string(),
  }),
  z.object({
    title: z.string(),
    description: z.string(),
    options: z.array(z.object({ value: z.string() })),
  }),
  z.object({ title: z.string(), content: z.string() }),
]);
export const CreatePost: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    console.log(`You chose: ${selectedValue}`);
  };
  const form = useForm({
    schema: CreatePostSchema,
  });
  const options = useFieldArray({
    control: form.control,
    name: "options",
  });

  const [postType, setPostType] = useState("POST");

  return (
    <Form {...form}>
      <Card className="mb-5 flex h-fit w-fit min-w-[40rem] max-w-xl flex-col bg-slate-100 p-2">
        <CardHeader>
          <div className="flex-column flex items-center justify-between gap-2">
            <div className="flex-column flex items-center">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </Avatar>
              <SmallText className="p-2">{"sad"}</SmallText>
            </div>
            <Select
              onValueChange={(V) => {
                setPostType(V);
              }}
              defaultValue={postType ?? "POST"}
            >
              <FormControl>
                <SelectTrigger className="w-40 bg-slate-100">
                  <SelectValue placeholder="Select type of section" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-slate-100">
                <SelectItem value="POST">Post</SelectItem>
                <SelectItem value="OFFERT">Offert</SelectItem>
                <SelectItem value="EVENT">Event</SelectItem>
                <SelectItem value="POLL">Poll</SelectItem>
              </SelectContent>
            </Select>
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

          {postType === "POST" ? (
            <FormField
              control={form.control}
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
                  <FormDescription>
                    This is your post description
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : postType === "EVENT" ? (
            <>
              <FormField
                control={form.control}
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
                    <FormDescription>
                      This is your post description
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full flex-row justify-between">
                <div className="w-full">
                  <FormField
                    control={form.control}
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
                        <FormDescription>
                          Select start date of event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
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
                        <FormDescription>
                          Select end date of event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Where are we going?"
                      ></Input>
                    </FormControl>
                    <FormDescription>This is location of event</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : postType === "OFFERT" ? (
            <>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Money, money, money"
                      ></Input>
                    </FormControl>
                    <FormDescription>Set price of this item</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
          ) : postType === "POLL" ? (
            <>
              <FormField
                control={form.control}
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
                    <FormDescription>
                      This is your post description
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {options.fields.map((field, optionIndex) => (
                <div className="space-y-6" key={field.id}>
                  <div className="flex items-center space-x-6">
                    <FormField
                      control={form.control}
                      name={`options.${optionIndex}.value`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Option {optionIndex+1}</FormLabel>
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
          ) : null}
        </CardContent>
        <CardFooter>
          <Button variant="default" className="w-full">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
};
