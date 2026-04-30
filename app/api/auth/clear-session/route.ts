import { NextResponse } from "next/server";

const EXPIRED = new Date(0);

export async function POST() {
  const response = NextResponse.json({ ok: true });

  const cookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
  ];

  cookieNames.forEach((name) => {
    response.cookies.set({
      name,
      value: "",
      path: "/",
      expires: EXPIRED,
      httpOnly: true,
      sameSite: "lax",
      secure: name.startsWith("__Secure-") || name.startsWith("__Host-"),
    });
  });

  return response;
}
