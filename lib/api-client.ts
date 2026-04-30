import axios from "axios";
import { CreateEntryPayload, TimesheetEntry, TimesheetWeek } from "@/types/timesheet";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export type TimesheetListResponse = {
  items: TimesheetWeek[];
  total: number;
};

export const fetchTimesheets = async (params: Record<string, string>) => {
  const { data } = await api.get<TimesheetListResponse>("/timesheets", { params });
  return data;
};

export const fetchEntriesByWeek = async (weekId: string) => {
  const { data } = await api.get<TimesheetEntry[]>(`/timesheet-entries/${weekId}`);
  return data;
};

export const fetchProjects = async () => {
  const { data } = await api.get<string[]>("/projects");
  return data;
};

export const fetchTypesOfWork = async () => {
  const { data } = await api.get<string[]>("/types-of-work");
  return data;
};

export const createTimesheetEntry = async (weekId: string, payload: CreateEntryPayload) => {
  const { data } = await api.post<TimesheetEntry>(`/timesheet-entries/${weekId}`, payload);
  return data;
};

export const updateTimesheetEntry = async (weekId: string, entryId: string, payload: CreateEntryPayload) => {
  const { data } = await api.put<TimesheetEntry>(`/timesheet-entries/${weekId}/${entryId}`, payload);
  return data;
};

export const deleteTimesheetEntry = async (weekId: string, entryId: string) => {
  await api.delete(`/timesheet-entries/${weekId}/${entryId}`);
};
