import { addMonths, format, getDay, parse, startOfWeek } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import React, { useCallback, useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  type Event,
  type SlotInfo,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { trpc } from "../../utils/trpc";
import { Container } from "../common/Container";
import { EventCreatePopup } from "./CreatePopup";
import { EventDetailPopup } from "./DetailPopup";

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

// TODO: Make custom styles for the calendar
export const Events: NextPage = () => {
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

  const { data: events, refetch } = trpc.event.calendar.useQuery(
    {
      start: start.toISOString(),
      end: end.toISOString(),
    },
    {
      refetchOnWindowFocus: false,
      initialData: [],
    }
  );
  const { mutateAsync } = trpc.event.create.useMutation({
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
    [mutateAsync, data]
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
    [data]
  );

  const handleSelectEvent = useCallback((event: Event) => {
    if (event.resource?.id) {
      setEventId(event.resource.id);
      setOpenDetailPopup(true);
    }
  }, []);

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );

  const handleRangeChange = useCallback(
    (
      range:
        | Date[]
        | {
            start: Date;
            end: Date;
          }
    ) => {
      if (Array.isArray(range)) {
        range[0] && setStart(range[0]);
        range[1] && setEnd(range[1]);
      } else {
        setStart(range.start);
        setEnd(range.end);
      }
    },
    []
  );

  return (
    <Container title="Events">
      <div className="py-4">
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

        <div className="h-[700px]">
          <Calendar
            defaultDate={defaultDate}
            defaultView={Views.MONTH}
            views={["month", "week", "day"]}
            events={events}
            localizer={localizer}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            scrollToTime={scrollToTime}
            onRangeChange={handleRangeChange}
          />
        </div>
      </div>
    </Container>
  );
};
