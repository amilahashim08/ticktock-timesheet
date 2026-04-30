import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import { TimesheetStatus } from "@/types/timesheet";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatWeekDateRange = (startDate: string, endDate: string) =>
  `${format(parseISO(startDate), "d MMMM, yyyy")} - ${format(parseISO(endDate), "d MMMM, yyyy")}`;

export const formatDay = (date: string) => format(parseISO(date), "MMM dd");

export const statusClassName: Record<TimesheetStatus, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-700",
  INCOMPLETE: "bg-amber-100 text-amber-700",
  MISSING: "bg-pink-100 text-pink-700",
};
