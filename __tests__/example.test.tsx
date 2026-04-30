import { render, screen } from "@testing-library/react";
import { formatWeekDateRange } from "@/lib/utils";

describe("formatWeekDateRange", () => {
  it("formats start and end dates", () => {
    render(<div>{formatWeekDateRange("2026-04-21", "2026-04-26")}</div>);
    expect(screen.getByText("21 April, 2026 - 26 April, 2026")).toBeInTheDocument();
  });
});
