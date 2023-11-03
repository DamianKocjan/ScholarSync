import { Ghost, Router, User } from "lucide-react";
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
} from "react-hook-form";
import { useState } from "react";

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
import { pollRouter } from "~/server/api/routers/poll";
import { api } from "~/utils/api";
import { useMemo } from "react";
import { Decimal } from "@prisma/client/runtime/library";
import { Attachment } from "aws-sdk/clients/ecs";
import { NumberEight } from "phosphor-react";
import { CreatePost } from "~/components/spotted/create-post";
interface ActivityPostProps {
  type: "POST",
  id: string,
  title: string,
  content: string,
  createdAt: Date,
  updatedAt: Date,
  user: { name: string },
  userId: string,
  comments: any[],
  numberOfComments: number,
  interactions: any[],
}
interface CreatePostProps {
  user: { name: string },
}
interface EventPostProps {
  id: string,
  title: string,
  description: string,
  from: Date,
  to: Date,
  location: string,
  createdAt: Date,
  updatedAt: Date,
  user: { name: string },
  userId: string,
  interestedInEvent: any[],
  comments: any[],
  numberOfComments: number,
  interactions: any[],
}
interface PollPostProps {
  id: string,
  title: string,
  description: string,
  createdAt: Date,
  updatedAt: Date,
  user: { name: string },
  userId: string,
  comments: any[],
  numberOfComments: number,
  options: any[],
  interactions: any[]
}
interface CommentPostProps{
  id: string,
  content: string,
  createdAt: Date,
  updatedAt: Date,
  user: {name: string}
  userId: string,
  interactions: any[]
}
interface OffertPostProps{
  id: string,
  title: string,
  user: {name: string}
  userId: string,
  description: string,
  createdAt: Date,
  updatedAt: Date,
  price: number,
  condition: "NEW" | "USED" | "UNKNOWN" ,
  image: string,
  imageId: string,
  category: string,
  comments: any[],
  numberOfComments: number,
  interactions: any[],

}
const OffertPost: React.FC<OffertPostProps> = ({user, description, createdAt, title, price, condition, category, numberOfComments, comments,image,}) =>{
  const DateFormatter = useFormatRelativeDate();
  const [isOpen, setisOpen] = useState(false);
  return(
    <Card className="w-fit min-w-[40rem] max-w-sm h-fit bg-slate-100 p-2 mb-5 flex flex-col">
    <CardHeader>
      <div className="flex flex-column gap-2 items-center">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        </Avatar>
        <div className="flex flex-col">
          <SmallText>{user.name}</SmallText>
          <SmallText>{DateFormatter(createdAt)}</SmallText>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <CardTitle className="text-xl"><H2>{title} - {price.toString()}</H2></CardTitle>
      <MutedText>Category: {category} Condition {condition}</MutedText>
      <p>{description}</p>
        <img src={image} className="w-full mt-7 min-h-[10rem] max-h-[30rem]"/>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant='outline'>Like</Button>
      <Button variant='ghost' onClick={() => setisOpen(!isOpen)}>Comments {numberOfComments}</Button>
    </CardFooter>
    {isOpen ? <Card className="w-fit min-w-[38.7rem] justify-center max-w-sm h-fit bg-slate-100 p-2 mb-5 flex flex-col"> 
      <CardTitle className="m-[1rem]">Comments</CardTitle>
      {comments.map((comment, index) => (
        <CommentPost {...comment} />
      ))}
    </Card> : <></>}
  </Card>
  )
}
const CommentPost: React.FC<CommentPostProps> = ({content, createdAt, user}) =>{
  const DateFormatter = useFormatRelativeDate();
  return(
    <Card>
    <CardHeader className="flex flex-col">
      <Avatar><AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /></Avatar>
      <div className="flex flex-row">{user.name} 
        <SmallText>{DateFormatter(createdAt)}</SmallText>
      </div>
    </CardHeader>
    <CardContent><Paragraph>{content}</Paragraph></CardContent>
  </Card>
  )
  }
const PollPost: React.FC<PollPostProps> = ({ title, createdAt, description, user, options, numberOfComments, comments, id }) => {
  const DateFormatter = useFormatRelativeDate();
  const {
    data: pollOptions,
    isLoading: pollOptionsLoading,
    isError: pollOptionsError,
    error: pollOptionsErrorData,
    refetch,
  } = api.poll.options.useQuery(
    {
      pollId: id,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const totalVotes = useMemo(
    () =>
      pollOptions?.result.reduce((acc, option) => acc + option._count.votes, 0) || 0,
    [pollOptions]
  );
  const { mutateAsync, isLoading } = api.poll.vote.useMutation({
    async onSuccess() {
      await refetch();
    },
  });

  const [isOpen, setisOpen] = useState(false);

  return (
    <Card className="w-fit min-w-[40rem] max-w-sm h-fit bg-slate-100 p-2 mb-5 flex flex-col">
      <CardHeader>
        <div className="flex flex-column gap-2 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
            <Button key={index} variant="outline" className="flex justify-between w-full mt-[1rem]"
              onClick={async () =>
                await mutateAsync({
                  optionId: option.id,
                  pollId: id,
                })
              } >
              <Paragraph>Option {index + 1} - {option}</Paragraph>
              <span className="flex flex-row"><p className="p-0">{Object.keys(option).length}</p></span>
            </Button>
          ))} 
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-row">
        <Button variant='outline'>Like</Button>
        <Button variant='ghost' onClick={() => setisOpen(!isOpen)}>Comments {numberOfComments}</Button>
      </CardFooter>
      {isOpen ? <Card className="w-fit min-w-[38.7rem] justify-center max-w-sm h-fit bg-slate-100 p-2 mb-5 flex flex-col"> 
        <CardTitle className="m-[1rem]">Comments</CardTitle>
        {comments.map((comment, index) => (
          <CommentPost {...comment} />
        ))}
      </Card> : <></>}
    </Card>
  )
}
const ActivityPost: React.FC<ActivityPostProps> = ({ title, comments, createdAt, content, user, numberOfComments, id }) => {
  const DateFormatter = useFormatRelativeDate();
  const {
    data: pollOptions,
    isLoading: pollOptionsLoading,
    isError: pollOptionsError,
    error: pollOptionsErrorData,
    refetch,
  } = api.poll.options.useQuery(
    {
      pollId: id,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const totalVotes = useMemo(
    () =>
      pollOptions?.result.reduce((acc, option) => acc + option._count.votes, 0) || 0,
    [pollOptions]
  );
  const { mutateAsync, isLoading } = api.poll.vote.useMutation({
    async onSuccess() {
      await refetch();
    },
  });

  const [isOpen, setisOpen] = useState(false);
  return (
    <Card className="w-fit min-w-[40rem] max-w-sm h-fit bg-slate-100 p-2 mb-5 flex flex-col">
      <CardHeader>
        <div className="flex flex-column gap-2 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
        <Button variant='ghost' onClick={() => setisOpen(!isOpen)}>Comments {numberOfComments}</Button>
      </CardFooter>
      {isOpen ? <Card className="w-fit min-w-[38.7rem] justify-center max-w-sm h-fit bg-slate-100 p-2 mb-5 flex flex-col"> 
        <CardTitle className="m-[1rem]">Comments</CardTitle>
        {comments.map((comment, index) => (
          <CommentPost {...comment} />
        ))}
      </Card> : <></>}
    </Card>
  );
// const CreatePost: React.FC<CreatePostProps> = ({ user }) => {
//   return (
//     <Card className="min-w-[40rem] w-fit max-w-xl h-fit bg-slate-100 p-2 mb-5 flex flex-col">
//       <CardHeader>
//         <div className="flex flex-column justify-between gap-2 items-center">
//           <div className="flex flex-column items-center">
//             <Avatar>
//               <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
//             </Avatar>
//             <SmallText className="p-2">{"sad"}</SmallText>
//           </div>
//           <Select>
//             <SelectTrigger className="w-[10rem] bg-slate-100" id="typeOfPost">
//               <SelectValue placeholder="Type" />
//             </SelectTrigger>
//             <SelectContent className=" bg-slate-100">
//               <SelectItem value="post">Post</SelectItem>
//               <SelectItem value="event">Event</SelectItem>
//               <SelectItem value="form">Form</SelectItem>
//               <SelectItem value="offert">Offert</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <Textarea placeholder="What's on your mind?" className="bg-slate-100 h-[15rem] resize-none">
//         </Textarea>
//       </CardContent>
//       <CardFooter>
//         <Button variant="default" className="w-full">Submit</Button>
//       </CardFooter>
//     </Card>
//   )
// }
const EventPost: React.FC<EventPostProps> = ({ user, id, comments, createdAt, title, from, to, location, description, numberOfComments }) => {
  const DateFormatter = useFormatRelativeDate();
  const {
    data: pollOptions,
    isLoading: pollOptionsLoading,
    isError: pollOptionsError,
    error: pollOptionsErrorData,
    refetch,
  } = api.poll.options.useQuery(
    {
      pollId: id,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const totalVotes = useMemo(
    () =>
      pollOptions?.result.reduce((acc, option) => acc + option._count.votes, 0) || 0,
    [pollOptions]
  );
  const { mutateAsync, isLoading } = api.poll.vote.useMutation({
    async onSuccess() {
      await refetch();
    },
  });

  const [isOpen, setisOpen] = useState(false);
  return (
    <Card className="w-fit min-w-[40rem] max-w-sm h-fit bg-slate-100 p-2 mb-5 flex flex-col">
      <CardHeader>
        <div className="flex flex-column gap-2 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          </Avatar>
          <div className="flex flex-col">
            <Paragraph>{user.name}</Paragraph>
            <SmallText>{DateFormatter(createdAt)}</SmallText>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <SmallText>{from.toLocaleDateString()} - {to.toLocaleDateString()} {location}</SmallText>
        <Paragraph>{description}</Paragraph>
        <Button variant="default" className="w-full mt-[1rem]">I'm interested in this event!</Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant='outline'>Like</Button>
        <Button variant='ghost' onClick={() => setisOpen(!isOpen)}>Comments {numberOfComments}</Button>
      </CardFooter>
      {isOpen ? <Card className="w-fit min-w-[38.7rem] justify-center max-w-sm h-fit bg-slate-100 p-2 mb-5 flex flex-col"> 
        <CardTitle className="m-[1rem]">Comments</CardTitle>
        {comments.map((comment, index) => (
          <CommentPost {...comment} />
        ))}
      </Card> : <></>}
    </Card>
  )
}}
export default function Home() {
  const post1 = {
    type: "POST",
    id: "0",
    title: 'Tytuł',
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. In, maiores? Lorem ipsum dolor sit amet consectetur adipisicing elit. In, maiores? ',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { name: 'Kartoniarz' },
    userId: '0',
    comments: [],
    numberOfComments: 2,
    interactions: [],
  } satisfies ActivityPostProps
  const post2 = {
    user: { name: "Wach00nia" }
  } satisfies CreatePostProps
  const post3 = {
    id: "0",
    title: "OMG IS IT A FNAF MOVIE",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum aliquid eum, amet reprehenderit dolor officiis sequi cumque quia aut maiores repudiandae perferendis quam odit, possimus nesciunt neque assumenda facilis commodi!",
    from: new Date(),
    to: new Date(),
    location: "Mojo Dojo Casa House",
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { name: 'Kartoniarz' },
    userId: '0',
    interestedInEvent: [],
    comments: [],
    numberOfComments: 2,
    interactions: [],
  } satisfies EventPostProps
  const post4 = {
    id: "2",
    title: "Gra roku 2023",
    description: "Zapraszam do wzięcia udziału w głosowaniu na gre roku :D",
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { name: "Hosiu" },
    userId: "69",
    comments: [],
    numberOfComments: 3,
    options: ["Civ 6", "It's fun to be a Polak", "Inscryption"],
    interactions: []
  } satisfies PollPostProps
  const post5 = {
    id: "3",
    title: "Sprzedam opla",
    user: {name: "Twój stary"},
    userId: "78200",
    description: "Sprzedam opla stan igła",
    createdAt: new Date(),
    updatedAt: new Date(),
    price: 6969.2,
    condition: "UNKNOWN",
    image: "sad",
    imageId: "231",
    category: "motoryzacja",
    comments: [],
    numberOfComments: 2,
    interactions: []
  } satisfies OffertPostProps
  return (
    <>
      <div className="flex flex-col items-center justify-center p-10">
          <CreatePost/>
      </div>
    </>
  );
}