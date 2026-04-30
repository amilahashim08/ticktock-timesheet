"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createTimesheetEntry,
  fetchProjects,
  fetchTypesOfWork,
  updateTimesheetEntry,
} from "@/lib/api-client";
import { TimesheetEntry } from "@/types/timesheet";

const schema = z.object({
  project: z.string().min(1, "Project is required"),
  typeOfWork: z.string().min(1, "Type of work is required"),
  task: z.string().min(3, "Task description is required"),
  hours: z.number().min(1, "At least 1 hour").max(12, "At most 12 hours"),
});

type EntryForm = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekId: string;
  date: string;
  currentEntry?: TimesheetEntry;
};

export function EntryModal({ open, onOpenChange, weekId, date, currentEntry }: Props) {
  const queryClient = useQueryClient();
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const { data: typesOfWork = [] } = useQuery({ queryKey: ["types"], queryFn: fetchTypesOfWork });

  const form = useForm<EntryForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      project: currentEntry?.project ?? "",
      typeOfWork: currentEntry?.typeOfWork ?? "",
      task: currentEntry?.task ?? "",
      hours: currentEntry?.hours ?? 1,
    },
  });

  useEffect(() => {
    form.reset({
      project: currentEntry?.project ?? "",
      typeOfWork: currentEntry?.typeOfWork ?? "",
      task: currentEntry?.task ?? "",
      hours: currentEntry?.hours ?? 1,
    });
  }, [currentEntry, form, open]);

  const mutation = useMutation({
    mutationFn: (values: EntryForm) =>
      currentEntry
        ? updateTimesheetEntry(weekId, currentEntry.id, { ...values, date })
        : createTimesheetEntry(weekId, { ...values, date }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", weekId] });
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-800/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between border-b border-zinc-200 pb-2">
            <Dialog.Title className="text-lg font-semibold">
              {currentEntry ? "Edit Entry" : "Add New Entry"}
            </Dialog.Title>
            <Dialog.Close className="text-zinc-400 hover:text-zinc-700">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={form.handleSubmit((vals) => mutation.mutate(vals))} className="space-y-3">
            <Field label="Select Project *" error={form.formState.errors.project?.message}>
              <select className="input" {...form.register("project")}>
                <option value="">Project Name</option>
                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Type of Work *" error={form.formState.errors.typeOfWork?.message}>
              <select className="input" {...form.register("typeOfWork")}>
                <option value="">Bug fixes</option>
                {typesOfWork.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Task description *" error={form.formState.errors.task?.message}>
              <textarea className="input min-h-24" {...form.register("task")} placeholder="Write text here ..." />
            </Field>

            <Field label="Hours *" error={form.formState.errors.hours?.message}>
              <input
                type="number"
                className="input max-w-20"
                min={1}
                max={12}
                {...form.register("hours", { valueAsNumber: true })}
              />
            </Field>

            <div className="flex gap-2 pt-2">
              <button className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                {currentEntry ? "Save changes" : "Add entry"}
              </button>
              <button
                type="button"
                className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-zinc-700">{label}</span>
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </label>
  );
}
