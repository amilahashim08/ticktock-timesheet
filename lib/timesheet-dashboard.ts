import { addDays, format, startOfMonth, startOfWeek } from "date-fns";

export function getRangeDates(dateRange: string): { from: string; to: string } {
  const now = new Date();
  if (dateRange === "this-week") {
    return {
      from: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
      to: format(addDays(startOfWeek(now, { weekStartsOn: 1 }), 6), "yyyy-MM-dd"),
    };
  }
  if (dateRange === "this-month") {
    return {
      from: format(startOfMonth(now), "yyyy-MM-dd"),
      to: format(addDays(startOfMonth(now), 31), "yyyy-MM-dd"),
    };
  }
  if (dateRange === "next-30-days") {
    return {
      from: format(now, "yyyy-MM-dd"),
      to: format(addDays(now, 30), "yyyy-MM-dd"),
    };
  }
  return { from: "", to: "" };
}

export function buildPageItems(totalPages: number, currentPage: number): Array<number | "..."> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }

  if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}
