import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      try {
        // `user` is only present on the first call after sign-in
        if (user) {
          token.id = user.id;
          token.role = "USER"; // Default role
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true, schoolId: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.schoolId = dbUser.schoolId;
          }
        }
        // Client called update() — re-sync role + schoolId from DB
        if (trigger === "update" && token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, schoolId: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.schoolId = dbUser.schoolId;
          }
        }
      } catch (error) {
        console.error("JWT callback error:", error);
        // Don't throw - allow token to return with defaults
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role) || "USER";
        session.user.schoolId = (token.schoolId as string) ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
