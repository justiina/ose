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

export type UserAuthType = {
  id: string;
  email: string;
  options: {
    data: {
      isAdmin: boolean | null;
      firstName: string;
      lastName: string;
    };
  };
};

export type InvitedUserType = {
  created_at: Date;
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
};

export type AddToInvitedUsersType = Omit<InvitedUserType, "created_at">;

export type GetInvitedUserType = {
  userData: InvitedUserType | null;
  error: string | null;
};

export type EventType = {
  id: string | null;
  created: string | null;
  createdBy: string | null;
  createdByName: string | null;
  title: string;
  date: string;
  time: string;
  type: string;
  place: string | null;
  placeLink: string | null;
  details: string | null;
  individuals: number | null;
  duration: string | null;
};

export type EditEventTypeForm = Omit<EventType, "createdByName">;

export type EditEventType = {
  eventData: EventType | null;
  error: string | null;
};

export type AddEventType = Omit<EventType, "id" | "createdByName">;

export type EventsByDateType = {
  eventData: EventType[] | null;
  error: string | null;
};

export type CalloutTrainingType = {
  date: string;
  organiser: string[];
  dogHead1: string | null;
  dogHead2: string | null;
};

export type GetCalloutTrainingsType = {
  data: CalloutTrainingType[] | null;
  error: string | null;
};
