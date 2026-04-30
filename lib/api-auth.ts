import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function requireApiSession() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { session: null, unauthorized: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
    }
    return { session, unauthorized: null };
  } catch {
    return { session: null, unauthorized: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }
}
