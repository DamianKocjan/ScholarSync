import { Popover, Transition } from "@headlessui/react";
import { useLottie } from "lottie-react";
import React, {
  forwardRef,
  Fragment,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useNumberFormatter } from "../../../hooks/formatters/useNumberFormatter";
import { classNames } from "../../../utils/classnames";
import { trpc } from "../../../utils/trpc";

import angryAnimation from "../../../../public/angry.json";
import hahaAnimation from "../../../../public/haha.json";
import likeAnimation from "../../../../public/like.json";
import loveAnimation from "../../../../public/love.json";
import sadAnimation from "../../../../public/sad.json";
import wowAnimation from "../../../../public/wow.json";

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
    ref
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
      [hasDBClicked, play]
    );
    const handleMouseLeave = useCallback(
      () => !hasDBClicked && stop(),
      [hasDBClicked, stop]
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
  }
);

const interactionAnimations = {
  LIKE: likeAnimation,
  HAHA: hahaAnimation,
  LOVE: loveAnimation,
  WOW: wowAnimation,
  SAD: sadAnimation,
  ANGRY: angryAnimation,
};

interface InteractionsProps {
  model: "ofert" | "post" | "event" | "poll" | "comment";
  modelId: string;
}

export const Interactions: React.FC<InteractionsProps> = ({
  model,
  modelId,
}) => {
  const formatNumber = useNumberFormatter();

  const { data, isLoading, isError, error, refetch } =
    trpc.interaction.get.useQuery(
      {
        modelId,
        model,
      },
      {
        refetchOnWindowFocus: false,
      }
    );
  const formattedInteractions = useMemo(
    () =>
      data?.interactions
        .sort((a, b) => b.count - a.count)
        .map((i) => formatNumber.format(i.count)),
    [data, formatNumber]
  );
  const mostInteractions = useMemo(
    () => data?.interactions.sort((a, b) => b.count - a.count)[0]?.type,
    [data]
  );

  const { mutateAsync, isLoading: isInteractionLoading } =
    trpc.interaction.interact.useMutation({
      onSuccess() {
        refetch();
      },
    });

  return (
    <div>
      <div className="flex -space-x-1">
        {isLoading ? (
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-300" />
        ) : isError ? (
          <div>{error?.message || error?.toString()}</div>
        ) : (
          <>
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    as={Interaction}
                    className={classNames(
                      data?.hasInteracted
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "hover:bg-gray-100",
                      "flex h-8 w-8 items-center justify-center rounded-full disabled:opacity-50"
                    )}
                    animationData={
                      interactionAnimations[
                        data?.hasInteracted?.type || mostInteractions || "LIKE"
                      ]
                    }
                    alt={
                      data?.hasInteracted?.type || mostInteractions || "LIKE"
                    }
                    lottieClassName={
                      data?.hasInteracted?.type ||
                      mostInteractions ||
                      "LIKE" === "LIKE"
                        ? "h-10 w-10"
                        : "h-8 w-8"
                    }
                    aria-label="Like"
                    onDoubleClick={async (
                      e: React.MouseEvent<HTMLButtonElement>
                    ) => {
                      e.preventDefault();
                      await mutateAsync({
                        model,
                        modelId,
                        type:
                          data?.hasInteracted?.type ||
                          mostInteractions ||
                          "LIKE",
                      });
                    }}
                  />

                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel
                      static
                      className="absolute left-[460%] z-10 mt-1 w-screen max-w-fit -translate-x-1/2 transform px-4 sm:px-0 md:left-1/2 lg:max-w-fit"
                    >
                      <div className="flex gap-2 rounded-lg bg-white px-2 py-2 shadow-lg ring-1 ring-black ring-opacity-5">
                        {data &&
                          data.interactions.map((interaction, i) => (
                            <div
                              className="flex flex-col items-center justify-center"
                              key={`${model}-${modelId}-${interaction.type}`}
                            >
                              <Interaction
                                title={`${
                                  interaction.count
                                } ${interaction.type.toLowerCase()}`}
                                className={classNames(
                                  data.hasInteracted &&
                                    data.hasInteracted.type === interaction.type
                                    ? "bg-gray-100 hover:bg-gray-200"
                                    : "hover:bg-gray-100",
                                  "flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-50"
                                )}
                                onClick={() =>
                                  mutateAsync({
                                    model,
                                    modelId,
                                    type: interaction.type,
                                  })
                                }
                                disabled={isInteractionLoading}
                                animationData={
                                  interactionAnimations[interaction.type]
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
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </>
        )}
      </div>
    </div>
  );
};
