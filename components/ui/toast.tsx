"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/toast-store";

export function Toast() {
  const { open, message, type, hide } = useToastStore();

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(hide, 2200);
    return () => clearTimeout(timer);
  }, [open, hide]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed right-4 top-4 z-50 rounded-md px-4 py-3 text-sm text-white shadow-md",
        type === "success" ? "bg-emerald-600" : "bg-rose-600",
      )}
    >
      {message}
    </div>
  );
}
