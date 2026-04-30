import { getStatusByWeek, getTotalHoursByWeek } from "@/lib/mock-db";

describe("timesheet status rules", () => {
  it("marks completed week as 40 hours", () => {
    expect(getTotalHoursByWeek("w1")).toBe(40);
    expect(getStatusByWeek("w1")).toBe("COMPLETED");
  });

  it("marks incomplete week as less than 40 hours", () => {
    expect(getTotalHoursByWeek("w3")).toBeLessThan(40);
    expect(getStatusByWeek("w3")).toBe("INCOMPLETE");
  });

  it("marks missing week as 0 hours", () => {
    expect(getTotalHoursByWeek("w5")).toBe(0);
    expect(getStatusByWeek("w5")).toBe("MISSING");
  });
});
