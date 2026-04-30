"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/timesheets" className="text-2xl font-bold text-zinc-900">
            ticktock
          </Link>
          <span className="text-sm font-medium text-zinc-600">Timesheets</span>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex items-center gap-1 text-sm text-zinc-600">
            {session?.user?.name ?? "User"}
            <ChevronDown className="h-4 w-4" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              className="rounded-md border border-zinc-200 bg-white p-1 shadow-md"
            >
              <DropdownMenu.Item
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="cursor-pointer rounded px-3 py-2 text-sm outline-none hover:bg-zinc-100"
              >
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
