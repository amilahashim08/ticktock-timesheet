import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center bg-zinc-100 px-6 py-10">
        <div className="w-full max-w-md">
          <h1 className="mb-6 text-3xl font-semibold text-zinc-800">Welcome back</h1>
          <LoginForm />
        </div>
      </div>
      <div className="hidden bg-blue-600 px-12 text-white lg:flex lg:items-center">
        <div className="max-w-md">
          <h2 className="mb-4 text-5xl font-semibold">ticktock</h2>
          <p className="text-md leading-relaxed text-blue-100">
          Introducing ticktock, our cutting-edge timesheet web application designed to revolutionize how you manage employee work hours. With ticktock, you can effortlessly track and monitor employee attendance and productivity from anywhere, anytime, using any internet-connected device.
          </p>
        </div>
      </div>
    </div>
  );
}
