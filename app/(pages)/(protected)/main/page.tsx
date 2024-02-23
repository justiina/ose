"use client";
import React, { useEffect, useState } from "react";
import EventCalendar from "@/app/components/EventCalendar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "react-hot-toast";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { getEvents } from "@/app/firebase/firestoreFunctions";

export default function Main() {
  const [events, setEvents] = useState<{ date: Date; type: string }[]>([]);

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

  // Check that user is logged in
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.error("Kirjaudu sisään / Please sign in");
      redirect("/");
    },
  });
  if (status === "loading") {
    return <LoadingIndicator />;
  }

  return (
    <div className="container mx-auto p-8">
      <EventCalendar
        events={events}
      />
    </div>
  );
}

Main.requireAuth = true;
