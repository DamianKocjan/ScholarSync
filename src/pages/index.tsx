import { Ghost, User } from "lucide-react";
import Head from "next/head";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import { Check } from 'lucide-react';
import { Accordion, AccordionItem } from "@radix-ui/react-accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form"

import {
  Blockquote,
  H1,
  H2,
  H3,
  H4,
  InlineCode,
  LargeText,
  Lead,
  MutedText,
  OrderedList,
  Paragraph,
  SmallText,
  UnorderedList,
} from "~/components/ui/typography";
import { useFormatRelativeDate } from "~/hooks/use-format-relative-date";
import { Icon } from "@radix-ui/react-select";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Toggle } from "@radix-ui/react-toggle";
interface ActivityPostProps {
  type: "POST",
  id: string,
  title: string,
  content: string,
  createdAt: Date,
  updatedAt: Date,
  user: {name: string},
  userId: string,
  comments: any[],
  numberOfComments: number,
  interactions: any[],
}
interface CreatePostProps{
  user: {name: string},
}
interface EventPostProps{
  id: string,
  title: string,
  description: string,
  from: Date,
  to: Date,
  location: string,
  createdAt: Date,
  updatedAt: Date,
  user: {name: string},
  userId: string,
  interestedInEvent: any[],
  comments: any[],
  numberOfComments: number,
  interactions: any[],
}
interface PollPostProps{
  id: string,
  title: string,
  description: string,
  createdAt: Date,
  updatedAt: Date,
  user: {name: string},
  userId: string,
  comments: any[],
  numberOfComments: number,
  options: any[],
  interactions: any[]
}
const PollPost : React.FC<PollPostProps> = ({title, createdAt, description, user, options, numberOfComments}) =>{
  const DateFormatter = useFormatRelativeDate();
  return(
    <Card className="w-fit min-w-[40rem] max-w-sm h-fit bg-slate-100 p-2 mb-5 flex flex-col">
    <CardHeader>
    <div className="flex flex-column gap-2 items-center">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
      </Avatar>
      <div className="flex flex-col">
        <Paragraph>{user.name}</Paragraph>
        <SmallText>{DateFormatter(createdAt)}</SmallText>
      </div>
    </div>
  </CardHeader> 
  <CardContent>
    <CardTitle>{title}</CardTitle>
    <Paragraph>{description}</Paragraph>
      <div className="form-field">
        {options.map((option, index) => (
             <Button key={index} variant="outline" className="flex justify-between w-full mt-[1rem]">
             <Paragraph>Option {index+1} - {option}</Paragraph>
             <span className="flex flex-row"><p className="p-0">{option}</p></span>
             </Button>
        ))}
      </div>
      <Checkbox />
  </CardContent>
  <CardFooter className="flex justify-between">
      <Button variant='outline'>Like</Button>
      <Button variant='ghost'>Comments {numberOfComments}</Button>
  </CardFooter>
    </Card>
  )
}
const ActivityPost : React.FC <ActivityPostProps> = ({title, createdAt, content, user, numberOfComments}) =>{
  const DateFormatter = useFormatRelativeDate();
  return (
    <Card className="w-fit min-w-[40rem] max-w-sm h-fit bg-slate-100 p-2 mb-5 flex flex-col">
      <CardHeader>
        <div className="flex flex-column gap-2 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
          </Avatar>
          <div className="flex flex-col">
            <SmallText>{user.name}</SmallText>
            <SmallText>{DateFormatter(createdAt)}</SmallText>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <Paragraph>{content}</Paragraph>
      </CardContent>
      <CardFooter className="flex justify-between">
          <Button variant='outline'>Like</Button>
          <Button variant='ghost'>Comments {numberOfComments}</Button>
      </CardFooter>
      </Card>
);
} 
const CreatePost : React.FC <CreatePostProps> = ({user}) =>{
  return (
    <Card className="min-w-[40rem] w-fit max-w-xl h-fit bg-slate-100 p-2 mb-5 flex flex-col">
    <CardHeader>    
      <div className="flex flex-column justify-between gap-2 items-center">
        <div className="flex flex-column items-center">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
        </Avatar>
        <SmallText className="p-2">{user.name}</SmallText>
        </div>
        <Select>
              <SelectTrigger className="w-[10rem] bg-slate-100" id="typeOfPost">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className=" bg-slate-100">
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="form">Form</SelectItem>
              </SelectContent>
            </Select>
      </div>
    </CardHeader>
    <CardContent>
      <Textarea placeholder="What's on your mind?"className="bg-slate-100 h-[15rem] resize-none">
      </Textarea>
    </CardContent>
    <CardFooter>
      <Button variant="default" className="w-full">Submit</Button>
    </CardFooter>
    </Card>
  )
}
const EventPost : React.FC<EventPostProps> = ({user, createdAt, title, from, to, location, description, numberOfComments}) =>{
  const DateFormatter = useFormatRelativeDate();
  return(
    <Card className="w-fit min-w-[40rem] max-w-sm h-fit bg-slate-100 p-2 mb-5 flex flex-col">
      <CardHeader>
        <div className="flex flex-column gap-2 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
          </Avatar>
          <div className="flex flex-col">
            <Paragraph>{user.name}</Paragraph>
            <SmallText>{DateFormatter(createdAt)}</SmallText>
          </div>
        </div>
      </CardHeader> 
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <SmallText>{from.toLocaleDateString()} - {to.toLocaleDateString() } {location}</SmallText>
        <Paragraph>{description}</Paragraph>
        <Button variant="default" className="w-full mt-[1rem]">I'm interested in this event!</Button>
      </CardContent>
      <CardFooter className="flex justify-between">
          <Button variant='outline'>Like</Button>
          <Button variant='ghost'>Comments {numberOfComments}</Button>
      </CardFooter>
      </Card>
  )
}
export default function Home() {
    const post1 = {
      type: "POST",
      id: "0",
      title: 'Tytuł',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. In, maiores? Lorem ipsum dolor sit amet consectetur adipisicing elit. In, maiores? ',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {name: 'Kartoniarz'},
      userId: '0',
      comments: [],
      numberOfComments: 2,
      interactions: [],
    }satisfies ActivityPostProps
    const post2 ={
      user: {name: "Wach00nia"}
    } satisfies CreatePostProps
    const post3 ={
      id: "0",
      title: "OMG IS IT A FNAF MOVIE",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum aliquid eum, amet reprehenderit dolor officiis sequi cumque quia aut maiores repudiandae perferendis quam odit, possimus nesciunt neque assumenda facilis commodi!",
      from: new Date(), 
      to: new Date(),
      location: "Mojo Dojo Casa House",
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {name: 'Kartoniarz'},
      userId: '0',
      interestedInEvent: [],
      comments: [],
      numberOfComments: 2,
      interactions: [],
    } satisfies EventPostProps
    const post4 ={
      id: "2",
      title: "Gra roku 2023",
      description: "Zapraszam do wzięcia udziału w głosowaniu na gre roku :D",
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {name: "Hosiu"},
      userId: "69",
      comments: [],
      numberOfComments: 3,
      options: ["Civ 6", "It's fun to be a Polak", "Inscryption"],
      interactions: []
    } satisfies PollPostProps
    return (
      <>
      <div className="flex flex-col items-center justify-center p-10">
        <PollPost {...post4}/>
      </div>
      </>
  );
}
