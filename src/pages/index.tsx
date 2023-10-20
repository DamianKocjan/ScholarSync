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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import { Accordion, AccordionItem } from "@radix-ui/react-accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
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
const ActivityPost : React.FC <ActivityPostProps> = ({title, createdAt, content, user, numberOfComments}) =>{
  return (
    <Card className="w-fit min-w-[40rem] max-w-sm h-fit bg-slate-100 p-2 flex flex-col">
      <CardHeader>
        <div className="flex flex-column gap-2 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-s">{user.name}</p>
            <p className="text-xs font-thin">{createdAt.getDate()}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <p className="pt-3 ">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
          <Button variant='outline'>Like</Button>
          <Button variant='ghost'>Comments {numberOfComments}</Button>
      </CardFooter>
      </Card>
);
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
  return (
      <>
      <div className="flex justify-center p-10">
      <Card className="min-w-[30rem] w-fit max-w-xl h-fit bg-slate-100 p-2 flex flex-col">
      <CardHeader>    
        <div className="flex flex-column justify-between gap-2 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
          </Avatar>
          <Select>
                <SelectTrigger className="w-[10rem]" id="framework">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="form">Form</SelectItem>
                </SelectContent>
              </Select>
        </div>
      </CardHeader>
      </Card>
      </div>
      </>
  );
}
