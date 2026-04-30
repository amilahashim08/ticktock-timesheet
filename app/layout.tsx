import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "@fontsource/inter/index.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ticktock Timesheet",
  description: "SaaS style timesheet management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
