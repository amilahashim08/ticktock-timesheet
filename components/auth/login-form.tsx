"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToastStore } from "@/store/toast-store";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password should be at least 6 characters"),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const showToast = useToastStore((state) => state.show);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "john@example.com", password: "password123", rememberMe: false },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/timesheets",
    });

    if (res?.ok && res.url) {
      showToast("Login successful");
      window.location.href = res.url;
      return;
    }

    showToast("Invalid credentials", "error");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1 block text-sm text-zinc-700">Email</label>
        <input className="w-full rounded-md border border-zinc-300 px-3 py-2" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm text-zinc-700">Password</label>
        <input
          type="password"
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
          {...register("password")}
        />
        {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-600">
        <input type="checkbox" {...register("rememberMe")} />
        Remember me
      </label>
      <button
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        Sign in
      </button>
    </form>
  );
}
