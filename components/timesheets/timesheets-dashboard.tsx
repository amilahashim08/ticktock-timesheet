"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { fetchTimesheets } from "@/lib/api-client";
import { buildPageItems, getRangeDates } from "@/lib/timesheet-dashboard";
import { formatWeekDateRange, statusClassName } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setDateRange,
  setPage,
  setPageSize,
  setStatus,
  toggleSort,
} from "@/store/timesheet-filters-slice";

export function TimesheetsDashboard() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.timesheetFilters);

  const { data, isLoading } = useQuery({
    queryKey: ["timesheets", filters],
    queryFn: () =>
      fetchTimesheets({
        ...Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, String(v)])),
      }),
  });

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / filters.pageSize));

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-4xl font-semibold tracking-tight text-zinc-900">Your Timesheets</h2>
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          className="h-9 min-w-36 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-600"
          value={filters.dateRange}
          onChange={(e) => {
            const dateRange = e.target.value;
            const { from, to } = getRangeDates(dateRange);
            dispatch(setDateRange({ dateRange, dateFrom: from, dateTo: to }));
          }}
        >
          <option value="">Date Range</option>
          <option value="this-week">This week</option>
          <option value="this-month">This month</option>
          <option value="next-30-days">Next 30 days</option>
        </select>
        <select
          className="h-9 min-w-32 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-600"
          value={filters.status}
          onChange={(e) => dispatch(setStatus(e.target.value))}
        >
          <option value="">Status</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
          <option value="missing">Missing</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs font-semibold text-zinc-500">
            <tr>
              <th
                className="cursor-pointer px-4 py-3.5"
                onClick={() => dispatch(toggleSort("weekNumber"))}
              >
                <span className="inline-flex items-center gap-2">WEEK # {sortIcon(filters, "weekNumber")}</span>
              </th>
              <th className="cursor-pointer px-4 py-3.5" onClick={() => dispatch(toggleSort("date"))}>
                <span className="inline-flex items-center gap-2">DATE {sortIcon(filters, "date")}</span>
              </th>
              <th className="px-4 py-3.5">STATUS</th>
              <th className="px-4 py-3.5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {(data?.items ?? []).map((row) => (
              <tr key={row.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50/60">
                <td className="px-4 py-4 text-zinc-700">{row.weekNumber}</td>
                <td className="px-4 py-4 text-zinc-600">{formatWeekDateRange(row.startDate, row.endDate)}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide ${statusClassName[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <Link href={`/timesheets/${row.id}`} className="font-medium text-blue-600 hover:text-blue-700">
                    {row.status === "INCOMPLETE" ? "Update" : row.status === "MISSING" ? "Create" : "View"}
                  </Link>
                </td>
              </tr>
            ))}
            {!isLoading && (data?.items?.length ?? 0) === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                  No timesheets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <select
          value={filters.pageSize}
          onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
          className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-600"
        >
          <option value={15}>15 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
        <div className="flex items-center rounded-md border border-zinc-200 bg-white text-sm text-zinc-600">
          <button
            disabled={filters.page <= 1}
            onClick={() => dispatch(setPage(filters.page - 1))}
            className="h-9 border-r border-zinc-200 px-3 transition-colors hover:bg-zinc-50 disabled:opacity-40"
          >
            Previous
          </button>
          {buildPageItems(totalPages, filters.page).map((item, index) =>
            item === "..." ? (
              <span key={`ellipsis-${index}`} className="h-9 px-2 leading-9">
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => dispatch(setPage(item))}
                className={`h-9 min-w-8 border-r border-zinc-200 px-2 transition-colors ${
                  item === filters.page
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "hover:bg-zinc-50"
                }`}
              >
                {item}
              </button>
            ),
          )}
          <button
            disabled={filters.page >= totalPages}
            onClick={() => dispatch(setPage(filters.page + 1))}
            className="h-9 px-3 transition-colors hover:bg-zinc-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

function sortIcon(
  filters: { sortBy: "weekNumber" | "date"; sortDir: "asc" | "desc" },
  key: "weekNumber" | "date",
) {
  if (filters.sortBy !== key) return <ChevronDown className="h-3 w-3 opacity-50" />;
  return filters.sortDir === "asc" ? (
    <ChevronUp className="h-3 w-3" />
  ) : (
    <ChevronDown className="h-3 w-3" />
  );
}
