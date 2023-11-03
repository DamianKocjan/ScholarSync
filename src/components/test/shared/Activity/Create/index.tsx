import { Listbox, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CaretDown, Check, WarningCircle } from "phosphor-react";
import React, { Fragment, useCallback, useMemo, useState } from "react";
import { trpc } from "../../../../utils/trpc";
import { Avatar } from "../../Avatar";
import { Button } from "../../Button";
import { LoadingSpinner } from "../../LoadingSpinner";
import { Event } from "./Event";
import { Ofert } from "./Ofert";
import { Poll } from "./Poll";
import { Post } from "./Post";
import { ActivityCreateData, ActivityCreateDataKeys } from "./types";

const activityTypes = ["post", "ofert", "poll", "event"] as const;
type ActivityType = typeof activityTypes[number];

export const CreateActivity: React.FC = () => {
  const { data: sessionData } = useSession();
  const [activityType, setActivityType] = useState<ActivityType>(
    activityTypes[0]
  );
  const [data, setData] = useState<ActivityCreateData>({
    event: {
      title: "",
      description: "",
      from: new Date().toISOString(),
      to: new Date().toISOString(),
      location: "",
    },
    ofert: {
      title: "",
      description: "",
      price: 0.0,
      category: "",
      condition: "UNKNOWN",
      image: undefined,
    },
    poll: {
      title: "",
      description: "",
      options: [],
    },
    post: {
      title: "",
      content: "",
    },
  });

  const handleSetData = useCallback(
    (key: ActivityCreateDataKeys, value: unknown) =>
      setData((data) => ({
        ...data,
        [activityType]: {
          ...data[activityType],
          [key]: value,
        },
      })),
    [activityType]
  );

  const isValid = useMemo(() => {
    switch (activityType) {
      case "post":
        return !!(data.post.title.trim() && data.post.content.trim());
      case "ofert":
        return !!(
          data.ofert.title.trim() &&
          data.ofert.description.trim() &&
          data.ofert.price > 0 &&
          data.ofert.category.trim()
        );
      case "poll":
        return !!(
          data.poll.title.trim() &&
          data.poll.description.trim() &&
          data.poll.options.length > 1 &&
          data.poll.options.length < 11 &&
          data.poll.options.every((option) => !!option.trim())
        );
      case "event":
        return !!(
          data.event.title.trim() &&
          data.event.description.trim() &&
          data.event.from.trim() &&
          data.event.to.trim() &&
          data.event.location.trim() &&
          new Date(data.event.from) < new Date(data.event.to)
        );
    }
  }, [data, activityType]);

  const handleUploadImage = useCallback(
    async ({
      url,
      fields,
    }: {
      url: string;
      fields: Record<string, unknown>;
    }) => {
      if (!data.ofert.image) return;

      const headers = {
        ...fields,
        "Content-Type": data.ofert.image.type,
        file: data.ofert.image,
      };

      const formData = new FormData();
      for (const name in headers) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        formData.append(name, headers[name]);
      }

      await fetch(url, {
        method: "POST",
        body: formData,
      });
    },
    [data]
  );

  const router = useRouter();
  const { isLoading, isError, error, mutateAsync } =
    trpc.feed.create.useMutation({
      async onSuccess(data) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        handleUploadImage(data.image).then(() =>
          router.push(`/activity/${data.id}`)
        );
      },
    });

  return (
    <div className="mb-4 divide-y divide-gray-200 rounded-lg bg-white shadow shadow-indigo-300 transition-shadow hover:shadow-md">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center gap-4">
          <Avatar src={sessionData?.user?.image} alt="User profile" />
          <h3 className="text-lg">What&apos;s on your mind?</h3>
          <div className="flex-1" />
          <Listbox value={activityType} onChange={setActivityType}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-base">
                <span className="block truncate">Type: {activityType}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <CaretDown
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {activityTypes.map((type, i) => (
                    <Listbox.Option
                      key={`activity-type-${i}`}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-indigo-100 text-indigo-900"
                            : "text-gray-900"
                        }`
                      }
                      value={type}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {type}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                              <Check className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await mutateAsync({
              type: activityType,
              data: {
                [activityType]: data[activityType],
              },
            });
          }}
        >
          {activityType === "event" ? (
            <Event data={data.event} handleSetData={handleSetData} />
          ) : activityType === "ofert" ? (
            <Ofert data={data.ofert} handleSetData={handleSetData} />
          ) : activityType === "poll" ? (
            <Poll data={data.poll} handleSetData={handleSetData} />
          ) : (
            <Post data={data.post} handleSetData={handleSetData} />
          )}

          {isError && (
            <div className="rounded-md border border-gray-100 p-2">
              <h3 className="flex items-center text-lg text-red-500">
                <WarningCircle className="mr-1 h-5 w-5 text-red-600" /> Error
              </h3>
              <p className="text-sm">{error?.message || error?.toString()}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-1 h-5 w-5" /> Loading...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
