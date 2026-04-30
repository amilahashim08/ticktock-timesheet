"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { deleteTimesheetEntry, fetchEntriesByWeek } from "@/lib/api-client";
import { formatDay } from "@/lib/utils";
import { EntryModal } from "@/components/timesheets/entry-modal";
import { TimesheetEntry } from "@/types/timesheet";

type Props = {
  weekId: string;
  dateLabel: string;
  startDate: string;
  endDate: string;
};

export function WeekDetails({ weekId, dateLabel, startDate, endDate }: Props) {
  const queryClient = useQueryClient();
  const { data: entries = [] } = useQuery({
    queryKey: ["entries", weekId],
    queryFn: () => fetchEntriesByWeek(weekId),
  });
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(startDate);
  const [editing, setEditing] = useState<TimesheetEntry | undefined>(undefined);

  const byDate = useMemo(() => {
    const grouped = new Map<string, TimesheetEntry[]>();
    entries.forEach((entry) => {
      grouped.set(entry.date, [...(grouped.get(entry.date) ?? []), entry]);
    });
    return eachDayOfInterval({
      start: parseISO(startDate),
      end: parseISO(endDate),
    }).map((day) => {
      const iso = format(day, "yyyy-MM-dd");
      return [iso, grouped.get(iso) ?? []] as [string, TimesheetEntry[]];
    });
  }, [entries, endDate, startDate]);

  const totalHours = entries.reduce((sum, item) => sum + item.hours, 0);
  const progress = Math.min(100, (totalHours / 40) * 100);

  const deleteMutation = useMutation({
    mutationFn: (entryId: string) => deleteTimesheetEntry(weekId, entryId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entries", weekId] }),
  });

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <Link
            href="/timesheets"
            className="mb-3 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-900">This week&apos;s timesheet</h2>
          <p className="mt-2 text-sm text-zinc-500">{dateLabel}</p>
        </div>
        <div className="w-52 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <div className="mb-1.5 flex items-center justify-between text-sm text-zinc-700">
            <span>{totalHours}/40 hrs</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-linear-to-r from-orange-400 to-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {byDate.map(([date, rows]) => (
          <div key={date} className="rounded-lg border border-zinc-100 bg-zinc-50/40 p-3">
            <h3 className="mb-2 font-semibold text-zinc-800">{formatDay(date)}</h3>
            <div className="space-y-2">
              {rows.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 transition-shadow duration-200 hover:shadow-sm"
                >
                  <span className="text-sm text-zinc-800">{entry.task}</span>
                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    <span>{entry.hours} hrs</span>
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {entry.project}
                    </span>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="rounded p-1 transition-colors hover:bg-zinc-100">
                        <MoreHorizontal className="h-4 w-4 text-zinc-600" />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content className="rounded border border-zinc-200 bg-white p-1 shadow">
                          <DropdownMenu.Item
                            className="cursor-pointer rounded px-2 py-1 text-sm hover:bg-zinc-100"
                            onClick={() => {
                              setEditing(entry);
                              setSelectedDate(entry.date);
                              setOpen(true);
                            }}
                          >
                            Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="cursor-pointer rounded px-2 py-1 text-sm text-rose-600 hover:bg-zinc-100"
                            onClick={() => deleteMutation.mutate(entry.id)}
                          >
                            Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </div>
              ))}
              <button
                className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-blue-300 bg-blue-50/60 py-2 text-sm font-medium text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => {
                  setSelectedDate(date);
                  setEditing(undefined);
                  setOpen(true);
                }}
              >
                <Plus className="h-4 w-4" /> Add new task
              </button>
            </div>
          </div>
        ))}
      </div>

      <EntryModal
        open={open}
        onOpenChange={setOpen}
        weekId={weekId}
        date={selectedDate}
        currentEntry={editing}
      />
    </section>
  );
}
