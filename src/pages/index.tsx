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
const ActivityPost : React.FC <ActivityPostProps> = ({title, createdAt, content, user, numberOfComments}) =>{
  return (
    <Card className="w-fit min-w-[40rem] max-w-sm h-fit bg-slate-100 p-2 mb-5 flex flex-col">
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
const CreatePost : React.FC <CreatePostProps> = ({user}) =>{
  return (
    <Card className="min-w-[30rem] w-fit max-w-xl h-fit bg-slate-100 p-2 mb-5 flex flex-col">
    <CardHeader>    
      <div className="flex flex-column justify-between gap-2 items-center">
        <div className="flex flex-column items-center">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
        </Avatar>
        <p className="p-2">{user.name}</p>
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
  return(
    <Card className="w-fit min-w-[40rem] max-w-sm h-fit bg-slate-100 p-2 mb-5 flex flex-col">
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
        <p className="text-xs">{from.getDate()} - {to.getDate()} {location}</p>
        <p className="pt-3 pb-[1rem]">{description}</p>
        <Button variant="default" className="w-full">I'm interested in this event!</Button>
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
  return (
      <>
      <div className="flex flex-col items-center justify-center p-10">
          <EventPost {...post3}/>
          <EventPost {...post3}/>
          <EventPost {...post3}/>
      </div>
      </>
  );
}
