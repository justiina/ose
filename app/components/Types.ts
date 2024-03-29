export type UserType = {
  id: string | null;
  created: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  group: string | null;
  role: string[] | null;
  showName: boolean | undefined;
  showEmail: boolean | undefined;
  showPhoneNumber: boolean | undefined;
};

export type GetUserType = {
  userData: UserType | null;
  error: string | null;
};

export type EventType = {
  id: string | null;
  created: string | null;
  createdBy: string | null;
  createdByName: string | null;
  title: string | null;
  date: string | null;
  time: string | null;
  type: string | null;
  place: string | null;
  placeLink: string | null;
  details: string | null;
  individuals: number | null;
  duration: number | null;
};

export type AddEventType = Omit<EventType, "id" | "createdByName">;

export type EventsByDateType = {
  eventData: EventType[] | null;
  error: string | null;
};
