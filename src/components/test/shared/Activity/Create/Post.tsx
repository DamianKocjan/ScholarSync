import React from "react";
import { Input } from "../../Input/Input";
import { Textarea } from "../../Input/Textarea";
import { ActivityCreateData, HandleSetPostData } from "./types";

interface PostProps {
  data: ActivityCreateData["post"];
  handleSetData: HandleSetPostData;
}

export const Post: React.FC<PostProps> = ({ data, handleSetData }) => {
  return (
    <>
      <div>
        <label htmlFor="title" className="sr-only">
          Title
        </label>
        <Input
          name="title"
          id="title"
          required
          placeholder="Your title..."
          value={data.title}
          onChange={(e) => handleSetData("title", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="content" className="sr-only">
          Your content
        </label>
        <Textarea
          name="content"
          id="content"
          required
          placeholder="Your content..."
          value={data.content}
          onChange={(e) => handleSetData("content", e.target.value)}
        />
      </div>
    </>
  );
};
