import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { TimesheetsDashboard } from "@/components/timesheets/timesheets-dashboard";
import { authOptions } from "@/lib/auth";

export default async function TimesheetsPage() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch {
    redirect("/login");
  }
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-zinc-100">
      <Navbar />
      <main className="mx-auto max-w-6xl p-4">
        <TimesheetsDashboard />
        <Footer />
      </main>
    </div>
  );
}
