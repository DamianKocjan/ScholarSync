import { X } from "phosphor-react";
import React, { useCallback, useMemo, useState } from "react";
import { Button } from "../../Button";
import { Input } from "../../Input/Input";
import { Textarea } from "../../Input/Textarea";
import { ActivityCreateData, HandleSetPollData } from "./types";

interface PollProps {
  data: ActivityCreateData["poll"];
  handleSetData: HandleSetPollData;
}

export const Poll: React.FC<PollProps> = ({ data, handleSetData }) => {
  const [option, setOption] = useState("");

  const isAddDisabled = useMemo(() => !option.trim(), [option]);

  const handleAddOption = useCallback(() => {
    if (!option.trim()) {
      return;
    }

    handleSetData("options", [...data.options, option.trim()]);
    setOption("");
  }, [data.options, handleSetData, option]);

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
        <label htmlFor="description" className="sr-only">
          Your description
        </label>
        <Textarea
          name="description"
          id="description"
          required
          placeholder="Your description..."
          value={data.description}
          onChange={(e) => handleSetData("description", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 p-2">
        <label htmlFor="options" className="sr-only">
          Option
        </label>
        <Input
          name="option"
          id="option"
          placeholder="Option..."
          value={option}
          onChange={(e) => setOption(e.target.value)}
        />
        <Button
          onClick={handleAddOption}
          disabled={isAddDisabled}
          type="button"
        >
          Add option
        </Button>

        {data.options.length > 0 && (
          <ul>
            {data.options.map((option, index) => (
              <li
                key={`option-${index}`}
                className="flex items-center justify-center"
              >
                <span className="mr-2">{index + 1}.</span>
                <span>{option}</span>
                <div className="flex-1" />
                <button
                  onClick={() =>
                    handleSetData(
                      "options",
                      data.options.filter((_, i) => i !== index)
                    )
                  }
                  className="text-lg text-indigo-900"
                  type="button"
                  title="Remove option"
                >
                  <X />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
