import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { useFormatRelativeDate } from "~/hooks/use-format-relative-date";
import { Card, CardHeader, CardContent} from "../ui/card";
import { SmallText, Paragraph } from "../ui/typography";


interface CommentProps{
    id: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
    user: {name: string}
}
export const Comment: React.FC<CommentProps> = ({content, createdAt, user}) =>{
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
  