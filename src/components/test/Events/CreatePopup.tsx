import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useMemo, useRef } from "react";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input/Input";
import { Textarea } from "../shared/Input/Textarea";

interface EventCreatePopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  data: {
    title: string;
    description: string;
    location: string;
    from: string;
    to: string;
  };
  setData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      location: string;
      from: string;
      to: string;
    }>
  >;
}

export const EventCreatePopup: React.FC<EventCreatePopupProps> = ({
  open,
  setOpen,
  data,
  onSubmit,
  setData,
}) => {
  const cancelButtonRef = useRef(null);

  const formatedFromDate = useMemo(
    () => data.from && new Date(data.from).toLocaleString(),
    [data.from]
  );
  const formatedToDate = useMemo(
    () => data.to && new Date(data.to).toLocaleString(),
    [data.to]
  );

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <form
              className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
              onSubmit={onSubmit}
            >
              <div>
                <div className="mt-3 sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create Event
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-4 py-2 px-1">
                    <div>
                      <label htmlFor="title" className="sr-only">
                        Event title
                      </label>
                      <Input
                        name="title"
                        id="title"
                        placeholder="Event title..."
                        value={data.title}
                        onChange={(e) =>
                          setData({
                            ...data,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="sr-only">
                        Event description
                      </label>
                      <Textarea
                        name="description"
                        id="description"
                        placeholder="Event description..."
                        value={data.description}
                        onChange={(e) =>
                          setData({
                            ...data,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="sr-only">
                        Event location
                      </label>
                      <Input
                        name="location"
                        id="location"
                        placeholder="Event location..."
                        value={data.location}
                        onChange={(e) =>
                          setData({
                            ...data,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex gap-4 text-lg text-indigo-500">
                      <p>
                        From:{" "}
                        <time dateTime={formatedFromDate}>
                          {formatedFromDate}
                        </time>
                        , to:{" "}
                        <time dateTime={formatedToDate}>{formatedToDate}</time>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <Button type="button" onClick={() => setOpen(false)}>
                  Submit
                </Button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-transparent bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
