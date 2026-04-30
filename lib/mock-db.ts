import { addDays, addWeeks, format, parseISO } from "date-fns";
import {
  CreateEntryPayload,
  TimesheetEntry,
  TimesheetStatus,
  TimesheetWeek,
  UserRecord,
} from "@/types/timesheet";

const baseWeekStart = parseISO("2026-01-05");
const statusPattern: TimesheetStatus[] = ["COMPLETED", "COMPLETED", "INCOMPLETE", "COMPLETED", "MISSING"];

const weekRanges = Array.from({ length: 45 }).map((_, idx) => {
  const start = addWeeks(baseWeekStart, idx);
  return {
    weekNumber: idx + 1,
    startDate: format(start, "yyyy-MM-dd"),
    endDate: format(addDays(start, 5), "yyyy-MM-dd"),
    status: statusPattern[idx % statusPattern.length],
  };
});

export const users: UserRecord[] = [
  { id: "u1", name: "John Doe", email: "john@example.com", password: "password123" },
];

export const projects = ["Project Name", "Mobile App", "Internal Tool"];
export const typesOfWork = ["Homepage Development", "Bug fixes", "Testing", "Meetings"];

export const timesheets: TimesheetWeek[] = weekRanges.map((range) => ({
  id: `w${range.weekNumber}`,
  ...range,
}));

let timesheetEntries: TimesheetEntry[] = timesheets.flatMap((week) => {
  const seededStatus = weekRanges[week.weekNumber - 1]?.status ?? "INCOMPLETE";
  const rowCount = seededStatus === "MISSING" ? 0 : seededStatus === "COMPLETED" ? 5 : 3;
  const hoursPerTask = seededStatus === "COMPLETED" ? 4 : 4;

  return Array.from({ length: rowCount }).flatMap((_, dayIdx) => {
    const baseDate = addDays(parseISO(week.startDate), dayIdx);
    return [
      {
        id: crypto.randomUUID(),
        weekId: week.id,
        date: format(baseDate, "yyyy-MM-dd"),
        task: "Homepage Development",
        hours: hoursPerTask,
        project: "Project Name",
        typeOfWork: "Homepage Development",
      },
      {
        id: crypto.randomUUID(),
        weekId: week.id,
        date: format(baseDate, "yyyy-MM-dd"),
        task: "Homepage Development",
        hours: hoursPerTask,
        project: "Project Name",
        typeOfWork: "Homepage Development",
      },
    ];
  });
});

export const getEntriesByWeek = (weekId: string) =>
  timesheetEntries.filter((entry) => entry.weekId === weekId);

export const getTotalHoursByWeek = (weekId: string) =>
  getEntriesByWeek(weekId).reduce((sum, entry) => sum + entry.hours, 0);

export const getStatusByWeek = (weekId: string): TimesheetStatus => {
  const totalHours = getTotalHoursByWeek(weekId);
  if (totalHours === 0) return "MISSING";
  if (totalHours >= 40) return "COMPLETED";
  return "INCOMPLETE";
};

export const createEntry = (weekId: string, payload: CreateEntryPayload) => {
  const entry: TimesheetEntry = { id: crypto.randomUUID(), weekId, ...payload };
  timesheetEntries = [entry, ...timesheetEntries];
  return entry;
};

export const updateEntry = (entryId: string, payload: CreateEntryPayload) => {
  let updated: TimesheetEntry | null = null;
  timesheetEntries = timesheetEntries.map((entry) => {
    if (entry.id !== entryId) return entry;
    updated = { ...entry, ...payload };
    return updated;
  });
  return updated;
};

export const deleteEntry = (entryId: string) => {
  const before = timesheetEntries.length;
  timesheetEntries = timesheetEntries.filter((entry) => entry.id !== entryId);
  return before !== timesheetEntries.length;
};
