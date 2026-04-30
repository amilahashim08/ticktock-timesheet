import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";
import { deleteEntry, updateEntry } from "@/lib/mock-db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ entryId: string }> },
) {
  const { unauthorized } = await requireApiSession();
  if (unauthorized) return unauthorized;

  const { entryId } = await params;
  const payload = await req.json();
  const updated = updateEntry(entryId, payload);

  if (!updated) {
    return NextResponse.json({ message: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ entryId: string }> },
) {
  const { unauthorized } = await requireApiSession();
  if (unauthorized) return unauthorized;

  const { entryId } = await params;
  const deleted = deleteEntry(entryId);

  if (!deleted) {
    return NextResponse.json({ message: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
