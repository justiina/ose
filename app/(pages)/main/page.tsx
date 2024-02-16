import EventCalendar from "@/app/components/EventCalendar";

const Main = () => { 
  return (
    <div className="container mx-auto p-4">
      <EventCalendar
        events={[
          { date: new Date("2024-02-05"), title: "MaA" },
          { date: new Date("2024-02-12"), title: "MaA" },
          { date: new Date("2024-02-05"), title: "MaB" },
          { date: new Date("2024-02-12"), title: "MaB" },
          { date: new Date("2024-02-06"), title: "TiA" },
          { date: new Date("2024-02-06"), title: "TiB" },
          { date: new Date("2024-02-29"), title: "Avoin" },
          { date: new Date("2024-02-24"), title: "Laji" },
          { date: new Date("2024-02-22"), title: "Häly" },
          { date: new Date("2024-02-18"), title: "Muu" },
        ]}
      />
    </div>
  );
};

export default Main;
