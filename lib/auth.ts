import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "@/lib/mock-db";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "ticktock-dev-nextauth-secret",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find(
          (current) =>
            current.email === credentials?.email && current.password === credentials?.password,
        );

        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.name = user.name;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.name = token.name;
      return session;
    },
  },
};
