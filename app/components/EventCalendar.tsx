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
import React, { useMemo, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineToday } from "react-icons/md";
import Dialog from "./Dialog";
import Link from "next/link";

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
  title: string;
}

interface EventCalendarPropsType {
  events: EventType[];
}

function EventCalendar({ events }: EventCalendarPropsType) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  // get the index of the weekday (week starts from Sunday (index 0) by default, we need it to start from Monday)
  const startingDayIndex =
    getDay(firstDayOfMonth) === 0 ? 6 : getDay(firstDayOfMonth) - 1;

  const eventsByDate = useMemo(() => {
    return events.reduce((acc: { [key: string]: EventType[] }, event) => {
      const dateKey = format(event.date, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {});
  }, [events]);

  const currentMonthIndex = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = MONTHNAMES[currentMonthIndex];

  // Define mapping between event titles and background colors
  const eventColorMap: { [key: string]: string } = {
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

  const handleClick = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const eventsForDay = eventsByDate[dateKey] || [];
    console.log(eventsForDay);
  };

  async function onClose() {
    console.log("Modal has closed")
    
  }
  async function onOk() {
    console.log("Ok was clicked")
    
  }

  return (
    <>
      <Dialog title="Esimerkkimodal" onClose={onClose} onOk={onOk}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
          magnam deserunt praesentium? Enim dolorum suscipit cum! Omnis aut
          voluptate mollitia ab adipisci, magni, dolorum aliquid perferendis
          amet fugiat soluta temporibus.
        </p>
      </Dialog>
      <div className="container mx-auto p-4">
        <div className="mb-4 flex justify-between gap-4">
          <button
            onClick={goToPreviousMonth}
            className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
          >
            <IoIosArrowBack className="text-2x" />
          </button>
          <div className="flex gap-2">
            <h1 className="text-center">
              {monthName} {currentYear}
            </h1>
            <button
              onClick={goToToday}
              className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
            >
              <MdOutlineToday className="text-2x" />
            </button>
          </div>

          <button
            onClick={goToNextMonth}
            className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
          >
            <IoIosArrowForward className="text-2x" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {WEEKDAYS.map((day) => {
            return (
              <div key={day} className="font-bold text-center">
                {day}
              </div>
            );
          })}
          {Array.from({ length: startingDayIndex }).map((_, index) => {
            return <div key={`empty-${index}`} className="min-h-20 min-w-16" />;
          })}
          {daysInMonth.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const todaysEvents = eventsByDate[dateKey] || [];
            return (
              <Link
                href="http://localhost:3000/main?showDialog=y"
                key={index}
                className={
                  isToday(day)
                    ? "cursor-pointer border-4 border-grey rounded-md p-1 text-end bg-white min-h-20 min-w-16"
                    : "cursor-pointer border border-grey rounded-md p-1  text-end bg-white min-h-20 min-w-16"
                }
              >
                {format(day, "d")}
                {todaysEvents.map((event, index) => {
                  const backgroundColor =
                    eventColorMap[event.title] || "bg-blue";
                  return (
                    <div
                      key={`event-${index}`}
                      className={`${backgroundColor} text-white cursor-pointer flex mb-1 items-center justify-center text-xs rounded-md`}
                    >
                      {event.title}
                    </div>
                  );
                })}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default EventCalendar;
