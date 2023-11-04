import { useLottie } from "lottie-react";
import React, { forwardRef, useCallback, useMemo, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import { useNumberFormatter } from "~/hooks/use-number-formatter";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { type ActivityType } from "./activity";

import ANGRY_ANIMATION from "../../../public/angry.json";
import HAHA_ANIMATION from "../../../public/haha.json";
import LIKE_ANIMATION from "../../../public/like.json";
import LOVE_ANIMATION from "../../../public/love.json";
import SAD_ANIMATION from "../../../public/sad.json";
import WOW_ANIMATION from "../../../public/wow.json";

interface InteractionProps {
  animationData: unknown;
  alt: string;
  className?: string;
  lottieClassName?: string;
  title?: string;
  onClick?: () => void;
  onDoubleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const Interaction = forwardRef<HTMLButtonElement, InteractionProps>(
  function Interaction(
    { alt, animationData, lottieClassName, onDoubleClick, ...props },
    ref,
  ) {
    const [hasDBClicked, setHasDBClicked] = useState(false);
    const { View, play, stop } = useLottie({
      animationData,
      loop: true,
      autoplay: false,
      alt,
      className: lottieClassName,
    });

    const handleMouseOver = useCallback(
      () => !hasDBClicked && play(),
      [hasDBClicked, play],
    );
    const handleMouseLeave = useCallback(
      () => !hasDBClicked && stop(),
      [hasDBClicked, stop],
    );

    return (
      <button
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={(e) => {
          setHasDBClicked(true);
          onDoubleClick?.(e);

          play();
          setTimeout(() => {
            stop();
            setHasDBClicked(false);
          }, 1000);
        }}
        {...props}
        ref={ref}
      >
        {View}
      </button>
    );
  },
);

// const ANGRY_ANIMATION = "/angry.json";
// const HAHA_ANIMATION = "/haha.json";
// const LIKE_ANIMATION = "/like.json";
// const LOVE_ANIMATION = "/love.json";
// const SAD_ANIMATION = "/sad.json";
// const WOW_ANIMATION = "/wow.json";

const INTERACTION_ANIMATIONS = {
  LIKE: LIKE_ANIMATION,
  HAHA: HAHA_ANIMATION,
  LOVE: LOVE_ANIMATION,
  WOW: WOW_ANIMATION,
  SAD: SAD_ANIMATION,
  ANGRY: ANGRY_ANIMATION,
} as const;

interface InteractionsProps {
  model: ActivityType | "COMMENT";
  modelId: string;
}

type InteractionType = keyof typeof INTERACTION_ANIMATIONS;

export const Interactions: React.FC<InteractionsProps> = ({
  model,
  modelId,
}) => {
  const formatNumber = useNumberFormatter();

  const { data, isLoading, isError, error, refetch } =
    api.interaction.get.useQuery(
      {
        modelId,
        model,
      },
      {
        refetchOnWindowFocus: false,
      },
    );
  const formattedInteractions = useMemo(
    () =>
      data
        ? data.interactions
            .sort((a, b) => b.count - a.count)
            .map((i) => formatNumber.format(i.count))
        : [],
    [data, formatNumber],
  );
  const mostInteractions = useMemo(
    () =>
      data
        ? data.interactions.sort((a, b) => b.count - a.count)[0]!.type
        : "LIKE",
    [data],
  );

  const { mutateAsync, isLoading: isInteractionLoading } =
    api.interaction.interact.useMutation({
      async onSuccess() {
        await refetch();
      },
    });

  return (
    <div>
      <div className="flex -space-x-1">
        {isLoading ? (
          <Skeleton className="h-6 w-6" />
        ) : isError ? (
          <div>{error?.message}</div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Interaction
                className={cn(
                  data?.hasInteracted
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "hover:bg-gray-100",
                  "flex h-8 w-8 items-center justify-center rounded-full disabled:opacity-50",
                )}
                animationData={
                  INTERACTION_ANIMATIONS[
                    (data?.hasInteracted?.type ??
                      mostInteractions ??
                      "LIKE") as InteractionType
                  ]
                }
                alt={data?.hasInteracted?.type ?? mostInteractions ?? "LIKE"}
                lottieClassName={
                  data?.hasInteracted?.type ??
                  mostInteractions ??
                  "LIKE" === "LIKE"
                    ? "h-10 w-10"
                    : "h-8 w-8"
                }
                aria-label="Like"
                onDoubleClick={async (
                  e: React.MouseEvent<HTMLButtonElement>,
                ) => {
                  e.preventDefault();
                  await mutateAsync({
                    model,
                    modelId,
                    type: (data?.hasInteracted?.type ??
                      mostInteractions ??
                      "LIKE") as InteractionType,
                  });
                }}
              />
            </PopoverTrigger>

            <PopoverContent className="flex w-fit gap-2 px-2 py-2">
              {data?.interactions.map((interaction, i) => (
                <div
                  className="flex flex-col items-center justify-center"
                  key={`${model}-${modelId}-${interaction.type}`}
                >
                  <Interaction
                    title={`${
                      interaction.count
                    } ${interaction.type.toLowerCase()}`}
                    className={cn(
                      data.hasInteracted &&
                        data.hasInteracted.type === interaction.type
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "hover:bg-gray-100",
                      "flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-50",
                    )}
                    onClick={() =>
                      mutateAsync({
                        model,
                        modelId,
                        type: interaction.type as InteractionType,
                      })
                    }
                    disabled={isInteractionLoading}
                    animationData={
                      INTERACTION_ANIMATIONS[
                        interaction.type as InteractionType
                      ]
                    }
                    alt={interaction.type}
                    lottieClassName="h-8 w-8"
                    aria-label={interaction.type.toLowerCase()}
                  />
                  <span className="text-xs text-gray-500">
                    {formattedInteractions?.[i]}
                  </span>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};
