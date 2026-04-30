import { NextRequest, NextResponse } from "next/server";
import { isAfter, isBefore, parseISO } from "date-fns";
import { requireApiSession } from "@/lib/api-auth";
import { getStatusByWeek, timesheets } from "@/lib/mock-db";

export async function GET(request: NextRequest) {
  const { unauthorized } = await requireApiSession();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const sortBy = searchParams.get("sortBy") ?? "weekNumber";
  const sortDir = searchParams.get("sortDir") ?? "asc";
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "15");

  let list = timesheets.map((item) => ({
    ...item,
    status: getStatusByWeek(item.id),
  }));

  if (status) {
    list = list.filter((item) => item.status === status.toUpperCase());
  }

  if (dateFrom || dateTo) {
    const from = dateFrom ? parseISO(dateFrom) : null;
    const to = dateTo ? parseISO(dateTo) : null;

    list = list.filter((item) => {
      const weekStart = parseISO(item.startDate);
      const weekEnd = parseISO(item.endDate);

      if (from && isBefore(weekEnd, from)) return false;
      if (to && isAfter(weekStart, to)) return false;
      return true;
    });
  }

  list.sort((a, b) => {
    const aVal = sortBy === "date" ? a.startDate : a.weekNumber;
    const bVal = sortBy === "date" ? b.startDate : b.weekNumber;
    if (sortDir === "desc") return aVal > bVal ? -1 : 1;
    return aVal > bVal ? 1 : -1;
  });

  const total = list.length;
  const start = (page - 1) * pageSize;
  const paged = list.slice(start, start + pageSize);

  return NextResponse.json({ items: paged, total });
}
