"use client";
import {
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
  subMonths,
  subYears,
} from "date-fns";
import React, { useMemo, useState, useEffect } from "react";
import { getEvents } from "@/app/actions";
import { useSearchParams, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineToday } from "react-icons/md";
import { FaPlus, FaListUl, FaRegCalendarAlt } from "react-icons/fa";
import { EventColorAndIconMap } from "../../../components/StyleMappingAndOptions";
import { EventType } from "@/app/components/Types";
import Dialog from "@/app/components/Dialog";
import Link from "next/link";
import DayCard from "./DayCard";
import toast from "react-hot-toast";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { HOST } from "@/app/components/HostInfo";

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

function EventCalendar({ currentUser }: { currentUser: string | undefined }) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [eventDate, setEventDate] = useState<string | null>(null);
  const firstDayOfMonth: Date = startOfMonth(currentDate);
  const lastDayOfMonth: Date = endOfMonth(currentDate);
  const searchParams = useSearchParams()!;
  const dateParams: string | null = searchParams.get("date");
  const router = useRouter();
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showList, setShowList] = useState<boolean>(false);

  useEffect(() => {
    if (dateParams !== null && eventDate !== dateParams) {
      const [year, month, day] = dateParams.split("-");
      setEventDate(`${day}.${month}.${year}`);
    }
  }, [dateParams, eventDate]);

  // Fetch the events data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await getEvents();
        if (eventData !== undefined) {
          if ("error" in eventData) {
            toast.error(eventData.error, { id: "fetchError" });
          } else {
            const eventArray: EventType[] = eventData.map(
              (doc) => doc as EventType
            );
            setEvents(eventArray);
            setIsLoading(false);
          }
        }
      } catch (error: any) {
        toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
          id: "fetchError2",
        });
      }
    };
    fetchData();
  }, [dateParams]);

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

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPreviousYear = () => {
    setCurrentDate(subYears(currentDate, 1));
  };
  const goToNextYear = () => {
    setCurrentDate(addYears(currentDate, 1));
  };

  const closeModal = async () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("date");
    window.history.replaceState({}, "", url.toString());
  };

  const renderEventList = () => {
    const filteredEvents = events.filter((event) => {
      return new Date(event.date).getFullYear() === currentDate.getFullYear();
    });
    const eventsByMonthAndYear = filteredEvents.reduce(
      (acc: { [key: string]: EventType[] }, event) => {
        const monthYear = format(event.date, "M yyyy");
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(event);
        return acc;
      },
      {}
    );

    // Sort the eventsByMonthAndYear array
    const sortedKeys = Object.keys(eventsByMonthAndYear).sort((a, b) => {
      const [monthA, yearA] = a.split(" ");
      const [monthB, yearB] = b.split(" ");
      const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1);
      const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1);
      return dateA.getTime() - dateB.getTime();
    });

    return (
      <>
        {/*---List of events in indicated year---*/}
        {sortedKeys.map((monthYear) => {
          const [month, year] = monthYear.split(" ");
          const monthName = MONTHNAMES[parseInt(month) - 1];

          return (
            <div key={monthYear}>
              <ul>
                <h2 className="mt-4">{monthName}</h2>
                {eventsByMonthAndYear[monthYear]
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .map((event, index) => (
                    <li
                      key={index}
                      className="grid grid-cols-5 md:max-w-2xl gap-4"
                    >
                      <span className="flex justify-end">
                        {format(event.date, "d.M.")}
                      </span>
                      <span className="col-span-3">{event.title}</span>
                      <span className="event-type">{event.type}</span>
                    </li>
                  ))}
              </ul>
            </div>
          );
        })}
      </>
    );
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <div className="container mx-auto lg:p-4">
        {/*---Heading with month name and year or only year if list view is selected---*/}
        <div className="grid grid-cols-12 mx-4">
          <div className="mb-4 flex justify-center gap-8 col-span-9 md:col-span-10">
            <button
              onClick={showList ? goToPreviousYear : goToPreviousMonth}
              className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
            >
              <IoIosArrowBack className="text-2xl" />
            </button>
            <div className="flex gap-2">
              <h1 className="text-center">
                {showList ? currentYear : `${monthName} ${currentYear}`}
              </h1>
              <button
                onClick={goToToday}
                className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
              >
                <MdOutlineToday className="text-2xl" />
              </button>
            </div>

            <button
              onClick={showList ? goToNextYear : goToNextMonth}
              className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
            >
              <IoIosArrowForward className="text-2xl" />
            </button>
          </div>
          <div className="col-span-3 md:col-span-2 flex justify-end gap-2">
            {showList ? (
              <button
                onClick={() => setShowList(!showList)}
                className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full bg-grey hover:bg-greyhover active:bg-grey text-background"
              >
                <FaRegCalendarAlt />
              </button>
            ) : (
              <button
                onClick={() => setShowList(!showList)}
                className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full bg-grey hover:bg-greyhover active:bg-grey text-background"
              >
                <FaListUl />
              </button>
            )}

            <button
              onClick={() => router.push("/addevent")}
              className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full bg-blue hover:bg-bluehover active:bg-grey text-background"
            >
              <FaPlus />
            </button>
          </div>
        </div>
        {showList ? (
          renderEventList()
        ) : (
          <div className="grid grid-cols-7 md:gap-2 md:p-4">
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
                  href={`${HOST}/main?showDialog=y&date=${dateKey}`}
                  key={index}
                  className={
                    isToday(day)
                      ? "cursor-pointer border-4 border-grey md:rounded-md p-1 text-end bg-white min-h-20"
                      : "cursor-pointer border border-grey md:rounded-md p-1  text-end bg-white min-h-20"
                  }
                >
                  {/*---Add events from Supabase---*/}
                  {format(day, "d")}
                  {todaysEvents.map((event, index) => {
                    const backgroundColor =
                      EventColorAndIconMap[event.type].color || "bg-grey";

                    return (
                      <div
                        key={`event-${index}`}
                        className={`${backgroundColor} text-white cursor-pointer flex mb-1 items-center justify-center text-xs rounded-full lg:mx-4 py-0.5`}
                      >
                        {event.type}
                      </div>
                    );
                  })}
                </Link>
              );
            })}
          </div>
        )}
      </div>
      {/*---Show days events on modal when clicked---*/}
      <Dialog title={eventDate} onClose={closeModal}>
        <DayCard currentUser={currentUser} />
      </Dialog>
    </>
  );
}

export default EventCalendar;
