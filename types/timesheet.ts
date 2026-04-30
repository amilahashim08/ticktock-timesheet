export type TimesheetStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type TimesheetWeek = {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
};

export type TimesheetEntry = {
  id: string;
  weekId: string;
  date: string;
  task: string;
  hours: number;
  project: string;
  typeOfWork: string;
};

export type CreateEntryPayload = {
  date: string;
  task: string;
  hours: number;
  project: string;
  typeOfWork: string;
};
