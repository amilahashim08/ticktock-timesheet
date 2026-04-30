import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WeekDetails } from "@/components/timesheets/week-details";
import { authOptions } from "@/lib/auth";
import { timesheets } from "@/lib/mock-db";
import { formatWeekDateRange } from "@/lib/utils";

export default async function TimesheetWeekPage({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch {
    redirect("/login");
  }
  if (!session) redirect("/login");

  const { weekId } = await params;
  const week = timesheets.find((item) => item.id === weekId);
  if (!week) notFound();

  return (
    <div className="min-h-screen bg-zinc-100">
      <Navbar />
      <main className="mx-auto max-w-6xl p-4">
        <WeekDetails
          weekId={week.id}
          startDate={week.startDate}
          endDate={week.endDate}
          dateLabel={formatWeekDateRange(week.startDate, week.endDate)}
        />
        <Footer />
      </main>
    </div>
  );
}
