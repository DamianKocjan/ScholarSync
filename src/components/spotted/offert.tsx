import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { useFormatRelativeDate } from "~/hooks/use-format-relative-date";
import { api } from "~/utils/api";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "../ui/card";
import { H2, MutedText, Paragraph, SmallText } from "../ui/typography";
import { Comment } from "./comment"
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
  export const OffertPost: React.FC<OffertPostProps> = ({user, description, createdAt, title, price, condition, category, numberOfComments, comments,image,}) =>{
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
          <Comment {...comment} />
        ))}
      </Card> : <></>}
    </Card>
    )
  }