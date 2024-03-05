"use client";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import React, { useMemo, useState, useEffect } from "react";
import { getEvents } from "@/app/firebase/firestoreFunctions";
import { useSearchParams, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineToday } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import Dialog from "../../../components/Dialog";
import Link from "next/link";
import DayCard from "./DayCard";

const WEEKDAYS = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"];

const MONTHNAMES = [
  "Tammikuu",
  "Helmikuu",
  "Maaliskuu",
  "Huhtikuu",
  "Toukokuu",
  "Kesäkuu",
  "Heinäkuu",
  "Elokuu",
  "Syyskuu",
  "Lokakuu",
  "Marraskuu",
  "Joulukuu",
];

interface EventType {
  date: Date;
  type: string;
}

interface EventCalendarPropsType {
  events: EventType[];
}

function EventCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [eventDate, setEventDate] = useState<string | null>(null);
  const firstDayOfMonth: Date = startOfMonth(currentDate);
  const lastDayOfMonth: Date = endOfMonth(currentDate);
  const searchParams = useSearchParams()!;
  const dateParams: string | null = searchParams.get("date");
  const router = useRouter();
  const [events, setEvents] = useState<{ date: Date; type: string }[]>([]);

  useEffect(() => {
    if (dateParams !== null && eventDate !== dateParams) {
      const [year, month, day] = dateParams.split("-");
      setEventDate(`${day}.${month}.${year}`);
    }
  }, [dateParams, eventDate]);

  // Fetch the events data
  useEffect(() => {
    const fetchData = async () => {
      const eventData = await getEvents("events");
      setEvents(
        eventData?.map(
          (event: { date: string | number | Date; type: string }) => ({
            date: new Date(event.date),
            type: event.type,
          })
        )
      );
    };
    fetchData();
  }, []);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  // Get the index of the weekday (week starts from Sunday (index 0) by default,
  // we need it to start from Monday)
  const startingDayIndex =
    getDay(firstDayOfMonth) === 0 ? 6 : getDay(firstDayOfMonth) - 1;

  const eventsByDate = useMemo(() => {
    if (events !== undefined) {
      return events.reduce((acc: { [key: string]: EventType[] }, event) => {
        const dateKey = format(event.date, "yyyy-MM-dd");
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
      }, {});
    } else return {};
  }, [events]);

  const currentMonthIndex = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = MONTHNAMES[currentMonthIndex];

  // Define mapping between event titles and background colors
  const eventColorMap: { [key: string]: string } = {
    MaA: "bg-blue",
    MaB: "bg-blue",
    TiA: "bg-blue",
    TiB: "bg-blue",
    Avoin: "bg-green",
    Laji: "bg-purple",
    Häly: "bg-orange",
    Muu: "bg-yellow",
  };

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const closeModal = async () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("date");
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <>
      <div className="container mx-auto p-4">
        {/*---Heading with month name and days---*/}
        <div className="grid grid-cols-12 mx-4">
          <div className="mb-4 flex justify-center gap-8 col-span-11">
            <button
              onClick={goToPreviousMonth}
              className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
            >
              <IoIosArrowBack className="text-2xl" />
            </button>
            <div className="flex gap-2">
              <h1 className="text-center">
                {monthName} {currentYear}
              </h1>
              <button
                onClick={goToToday}
                className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
              >
                <MdOutlineToday className="text-2xl" />
              </button>
            </div>

            <button
              onClick={goToNextMonth}
              className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
            >
              <IoIosArrowForward className="text-2xl" />
            </button>
          </div>
          <div className="col-span-1 flex justify-end">
            <button
              onClick={() => router.push("/addevent")}
              className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full bg-orange hover:bg-grey text-background"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 p-4">
          {WEEKDAYS.map((day) => {
            return (
              <div key={day} className="font-bold text-center">
                {day}
              </div>
            );
          })}

          {/*---Add empty boxes to start if month doesn't start on Monday---*/}
          {Array.from({ length: startingDayIndex }).map((_, index) => {
            return <div key={`empty-${index}`} className="min-h-20" />;
          })}

          {/*---Highlight today and show events---*/}
          {daysInMonth.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const todaysEvents = eventsByDate[dateKey] || [];
            return (
              <Link
                href={`http://localhost:3000/main?showDialog=y&date=${dateKey}`}
                key={index}
                className={
                  isToday(day)
                    ? "cursor-pointer border-4 border-grey rounded-md p-1 text-end bg-white min-h-20"
                    : "cursor-pointer border border-grey rounded-md p-1  text-end bg-white min-h-20"
                }
              >
                {/*---Add events from Firebase---*/}
                {format(day, "d")}
                {todaysEvents.map((event, index) => {
                  const backgroundColor =
                    eventColorMap[event.type] || "bg-grey";
                  return (
                    <div
                      key={`event-${index}`}
                      className={`${backgroundColor} text-white cursor-pointer flex mb-1 items-center justify-center text-xs rounded-full mx-4 py-0.5`}
                    >
                      {event.type}
                    </div>
                  );
                })}
              </Link>
            );
          })}
        </div>
      </div>
      {/*---Show days events on modal when clicked---*/}
      <Dialog title={eventDate} onClose={closeModal}>
        <DayCard date={eventDate} />
      </Dialog>
    </>
  );
}

export default EventCalendar;
