import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";
import { createEntry, getEntriesByWeek } from "@/lib/mock-db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ week: string }> }) {
  const { unauthorized } = await requireApiSession();
  if (unauthorized) return unauthorized;

  const { week } = await params;
  return NextResponse.json(getEntriesByWeek(week));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ week: string }> }) {
  const { unauthorized } = await requireApiSession();
  if (unauthorized) return unauthorized;

  const { week } = await params;
  const payload = await req.json();
  const entry = createEntry(week, payload);
  return NextResponse.json(entry, { status: 201 });
}
