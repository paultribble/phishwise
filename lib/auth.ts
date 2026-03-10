import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db";

/**
 * NextAuth Configuration for PhishWise
 *
 * Setup:
 * 1. Google OAuth credentials from Google Cloud Console
 * 2. Environment variables:
 *    - NEXTAUTH_URL: Auto-set by Vercel per deployment
 *    - NEXTAUTH_SECRET: Random 32-byte secret (same across environments)
 *    - GOOGLE_CLIENT_ID: From Google Cloud Console
 *    - GOOGLE_CLIENT_SECRET: From Google Cloud Console
 *
 * See OAUTH_SETUP.md for detailed setup instructions
 */

// Validate required environment variables
const validateEnvVars = () => {
  const required = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "NEXTAUTH_SECRET"];
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
  // Use PrismaAdapter to store sessions/accounts in database
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],

  // JWT strategy for stateless sessions
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Google OAuth provider
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: false, // Prevent account takeover
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
