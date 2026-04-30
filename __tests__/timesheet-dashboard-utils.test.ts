import { buildPageItems, getRangeDates } from "@/lib/timesheet-dashboard";

describe("timesheet dashboard helpers", () => {
  it("builds compact pagination list with ellipsis", () => {
    expect(buildPageItems(12, 6)).toEqual([1, "...", 5, 6, 7, "...", 12]);
  });

  it("returns this-week range", () => {
    const range = getRangeDates("this-week");
    expect(range.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(range.to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
