import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { useFormatRelativeDate } from "~/hooks/use-format-relative-date";
import { api } from "~/utils/api";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "../ui/card";
import { Paragraph, SmallText } from "../ui/typography";
import { Comment } from "./comment"
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
  export const EventPost: React.FC<EventPostProps> = ({ user, id, comments, createdAt, title, from, to, location, description, numberOfComments }) => {
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
            <Comment {...comment} />
          ))}
        </Card> : <></>}
      </Card>
    )
  }