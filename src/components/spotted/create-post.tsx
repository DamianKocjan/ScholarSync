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
import { useForm as _useForm, type UseFormProps } from "react-hook-form";
import z, { type TypeOf, type ZodSchema } from "zod";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";

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

export const CreatePost: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    console.log(`You chose: ${selectedValue}`);
  };
  const form = useForm({
    schema: z.object({ type: z.string() }),
  });

  const [elements1, setElements] = useState(["Option 1"]);

  const postType = form.watch("type");
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
            <>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Section type</FormLabel> */}
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? "POST"}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          </div>
        </CardHeader>
        <CardContent>
          <Paragraph>Title</Paragraph>
          <Input
            type="title"
            className="bg-slate-100"
            placeholder="Be creative!"
          />
          <Paragraph>Description</Paragraph>
          <Textarea
            placeholder="What's on your mind?"
            className="h-[15rem] resize-none bg-slate-100"
          ></Textarea>
          {postType === "POST" ? (
            <p>pOST</p>
          ) : postType === "EVENT" ? (
            <>
              <div className="flex w-full flex-row justify-between">
                <div className="w-full">
                  <Paragraph>Start date</Paragraph>
                  <Calendar
                    mode="single"
                    className="w-min rounded-md border bg-gray-200"
                  />
                </div>
                <div className="w-full">
                  <Paragraph>End date</Paragraph>
                  <Calendar
                    mode="single"
                    className="w-min rounded-md border bg-gray-200"
                  />
                </div>
              </div>
              <Paragraph>Location</Paragraph>
              <Input
                type="location"
                className="bg-slate-100"
                placeholder="Where?"
              />
            </>
          ) : postType === "OFFERT" ? (
            <>
              <Paragraph>Price</Paragraph>
              <Input type="price" className="bg-slate-100" />
              <Paragraph>Category</Paragraph>
              <Input type="category" className="bg-slate-100" />
              <Paragraph>Condition</Paragraph>
              <Select>
                <SelectTrigger className="w-40 bg-slate-100">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent className="bg-slate-100">
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="USED">Used</SelectItem>
                  <SelectItem value="UNKNOWN">Unknown</SelectItem>
                </SelectContent>
              </Select>
              <Paragraph>Image</Paragraph>
              <Input type="image" className="bg-slate-100" />
            </>
          ) : postType === "POLL" ? (
            <>
              <Paragraph></Paragraph>
              <Button
                onClick={() => {
                  console.log(elements1);
                  setElements([
                    ...elements1,
                    "Option " + Number(elements1.length + 1),
                  ]);
                }}
              >
                Add Option+
              </Button>
              {elements1.sort().map((e, i) => (
                <>
                  <Paragraph>Option {Number(i + 1)}</Paragraph>
                  <Input className="bg-slate-100" />
                  <Button
                    onClick={() => {
                      setElements(
                        elements1
                          .filter((x) => x != `Option ${Number(i + 1)}`)
                          .filter(String),
                      );
                      console.log(elements1);
                    }}
                  >
                    Remove
                  </Button>
                </>
              ))}
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
