// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile && "sub" in profile) {
        (token as any).googleSub = (profile as any).sub;
        if ("email" in profile) (token as any).email = (profile as any).email;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).googleSub = (token as any).googleSub;
      (session as any).email = (token as any).email;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
