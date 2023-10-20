import { useSession } from "next-auth/react";
import React, { useCallback, useState } from "react";
import { trpc } from "../../../../utils/trpc";
import { Avatar } from "../../Avatar";
import { Textarea } from "../../Input/Textarea";

interface CommentInputProps {
  model: "post" | "ofert" | "event" | "poll";
  modelId: string;
  refetch: () => Promise<void>;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  model,
  modelId,
  refetch,
}) => {
  const { data: sessionData } = useSession();
  const [content, setContent] = useState("");
  const mutation = trpc.comment.create.useMutation({
    async onSuccess() {
      setContent("");
      await refetch();
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const parsedContent = content.trim();
      if (!parsedContent) return;

      await mutation.mutateAsync({
        content: parsedContent,
        model,
        modelId,
      });
    },
    [content, mutation, model, modelId]
  );

  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <Avatar src={sessionData?.user?.image} alt="User profile" />
      </div>
      <div className="min-w-0 flex-1">
        <form onSubmit={handleSubmit}>
          <div className="border-b border-gray-200 focus-within:border-indigo-600">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <Textarea
              name="comment"
              id="comment"
              placeholder="Add your comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex justify-between pt-2">
            <div className="flex items-center space-x-5">
              <div className="flow-root"></div>
              <div className="flow-root"></div>
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Comment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
