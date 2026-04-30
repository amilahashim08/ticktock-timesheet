import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";
import { typesOfWork } from "@/lib/mock-db";

export async function GET() {
  const { unauthorized } = await requireApiSession();
  if (unauthorized) return unauthorized;

  return NextResponse.json(typesOfWork);
}
