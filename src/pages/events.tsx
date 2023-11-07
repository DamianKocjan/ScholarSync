import { addMonths, format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useCallback, useMemo, useState } from "react";
import {
  Calendar,
  Views,
  dateFnsLocalizer,
  type SlotInfo,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Error } from "~/components/error";
import { Loader } from "~/components/loader";
import { ActivityEvent } from "~/components/spotted/activity-event";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { H1 } from "~/components/ui/typography";
import { api } from "~/utils/api";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Events() {
  useSession({ required: true });

  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openDetailPopup, setOpenDetailPopup] = useState(false);
  const [eventId, setEventId] = useState("");
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(addMonths(new Date(), 1));

  const [data, setData] = useState({
    title: "",
    description: "",
    location: "",
    from: "",
    to: "",
  });

  const { data: events, refetch } = api.event.calendar.useQuery(
    {
      start: start.toISOString(),
      end: end.toISOString(),
    },
    {
      refetchOnWindowFocus: false,
      initialData: [],
    },
  );
  const { mutateAsync } = api.event.create.useMutation({
    async onSuccess() {
      await refetch();
      setData({
        title: "",
        description: "",
        location: "",
        from: "",
        to: "",
      });
    },
  });

  const handleCreateEvent = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await mutateAsync(data);
    },
    [mutateAsync, data],
  );

  const handleSelectSlot = useCallback(
    ({ start, end }: SlotInfo) => {
      setData({
        ...data,
        from: start.toISOString(),
        to: end.toISOString(),
      });
      setOpenCreatePopup(true);
    },
    [data],
  );

  const handleSelectEvent = useCallback(
    (
      event: Event & {
        resource?: {
          id: string;
        };
      },
    ) => {
      if (event.resource?.id) {
        setEventId(event.resource.id);
        setOpenDetailPopup(true);
      }
    },
    [],
  );

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    [],
  );

  const handleRangeChange = useCallback(
    (
      range:
        | Date[]
        | {
            start: Date;
            end: Date;
          },
    ) => {
      if (Array.isArray(range)) {
        range[0] && setStart(range[0]);
        range[1] && setEnd(range[1]);
      } else {
        setStart(range.start);
        setEnd(range.end);
      }
    },
    [],
  );

  return (
    <>
      <NextSeo title="Events" />

      <EventCreatePopup
        open={openCreatePopup}
        setOpen={setOpenCreatePopup}
        onSubmit={handleCreateEvent}
        data={data}
        setData={setData}
      />
      <EventDetailPopup
        open={openDetailPopup}
        setOpen={setOpenDetailPopup}
        id={eventId}
      />

      <main className="mx-auto flex flex-col items-center space-y-6 sm:w-2/3">
        <H1>Events</H1>

        <div className="h-[500px]">
          <Calendar
            defaultDate={defaultDate}
            defaultView={Views.MONTH}
            views={["month", "week", "day"]}
            // @ts-expect-error TODO: fix types
            events={events}
            localizer={localizer}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            scrollToTime={scrollToTime}
            onRangeChange={handleRangeChange}
          />
        </div>
      </main>
    </>
  );
}

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
  const formattedFromDate = useMemo(
    () => data.from && new Date(data.from).toLocaleString(),
    [data.from],
  );
  const formattedToDate = useMemo(
    () => data.to && new Date(data.to).toLocaleString(),
    [data.to],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create event</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={onSubmit}
          id="createEventForm"
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Event title
            </Label>
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
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Event description
            </Label>
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
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Event location
            </Label>
            <Textarea
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
              className="col-span-3"
            />
          </div>

          <p>
            From: <time dateTime={formattedFromDate}>{formattedFromDate}</time>,
            to: <time dateTime={formattedToDate}>{formattedToDate}</time>
          </p>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="createEventForm"
            onClick={() => setOpen(false)}
          >
            Submit
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface EventDetailPopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
}

export const EventDetailPopup: React.FC<EventDetailPopupProps> = ({
  open,
  setOpen,
  id,
}) => {
  const { data, isLoading, isError, error } = api.event.get.useQuery(
    {
      id,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-min">
        <DialogHeader>
          <DialogTitle>Create event</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <Error title="Something went wrong!" description={error?.message} />
          ) : data ? (
            <ActivityEvent {...data} />
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
