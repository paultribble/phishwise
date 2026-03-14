import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import * as bcryptjs from "bcryptjs";

/**
 * NextAuth Configuration for PhishWise
 *
 * Authentication: Email + Password with bcryptjs hashing
 * Session: JWT strategy (stateless, no database sessions)
 *
 * Environment variables:
 * - NEXTAUTH_URL: Auto-set by Vercel per deployment
 * - NEXTAUTH_SECRET: Random 32-byte secret (same across environments)
 */

// Validate required environment variables
const validateEnvVars = () => {
  const required = ["NEXTAUTH_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const errorMsg = `Missing required environment variables: ${missing.join(", ")}`;
    console.error(errorMsg);
    if (process.env.NODE_ENV === "production") {
      throw new Error(errorMsg);
    }
  }
};

validateEnvVars();

export const authOptions: NextAuthOptions = {
  // JWT strategy for stateless sessions
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Credentials provider for email + password (and magic link tokens)
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        magicToken: { label: "Magic Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          // Magic link sign-in path
          if (credentials?.magicToken) {
            const record = await prisma.authToken.findUnique({
              where: { token: credentials.magicToken },
            });

            if (
              !record ||
              record.type !== "magic" ||
              record.usedAt ||
              record.expiresAt < new Date()
            ) {
              return null;
            }

            // Mark token as used
            await prisma.authToken.update({
              where: { id: record.id },
              data: { usedAt: new Date() },
            });

            const user = await prisma.user.findUnique({
              where: { email: record.email },
              select: { id: true, email: true, name: true, role: true, schoolId: true },
            });

            if (!user) return null;

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              schoolId: user.schoolId,
            };
          }

          // Standard email + password path
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: { id: true, email: true, name: true, password: true, role: true, schoolId: true },
          });

          if (!user || !user.password) {
            return null;
          }

          const isValidPassword = await bcryptjs.compare(credentials.password, user.password);

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            schoolId: user.schoolId,
          };
        } catch (error) {
          console.error("[NextAuth] Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Callbacks for token/session customization
  callbacks: {
    /**
     * JWT Callback: Called when token is created/updated
     * Adds user role and school ID to token
     */
    async jwt({ token, user, trigger }) {
      try {
        // First sign-in: user object is present
        if (user) {
          token.id = user.id;
          // Default to USER role, will be overridden if found in DB
          token.role = "USER";
          token.schoolId = null;

          // Fetch user's actual role from database
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true, schoolId: true },
          });

          if (dbUser) {
            token.role = dbUser.role;
            token.schoolId = dbUser.schoolId;
          }
        }

        // Session update: client called update() - re-sync from DB
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
        console.error("[NextAuth] JWT callback error:", error);
        // Continue with defaults instead of failing - ensures user can still log in
        if (!token.role) token.role = "USER";
      }

      return token;
    },

    /**
     * Session Callback: Called when session is requested
     * Populates session object with token data for client access
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role) || "USER";
        session.user.schoolId = (token.schoolId as string) ?? null;
      }

      return session;
    },

    /**
     * Redirect Callback: Control where users are redirected after signin
     */
    async redirect({ url, baseUrl }) {
      // Allow callback URLs on same origin
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow callback URLs on same origin
      if (new URL(url).origin === baseUrl) return url;
      // Fallback to dashboard
      return `${baseUrl}/dashboard`;
    },
  },

  // Debug mode (disable in production)
  debug: process.env.NODE_ENV !== "production",
};
