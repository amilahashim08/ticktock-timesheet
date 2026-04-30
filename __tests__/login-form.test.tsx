import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LoginForm } from "@/components/auth/login-form";

const signInMock = jest.fn();

jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => signInMock(...args),
}));

describe("LoginForm", () => {
  it("redirects on successful login", async () => {
    signInMock.mockResolvedValue({ ok: true, url: "/timesheets" });
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(signInMock).toHaveBeenCalledWith(
        "credentials",
        expect.objectContaining({ callbackUrl: "/timesheets" }),
      ),
    );
  });
});
