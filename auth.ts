import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Keep Google "sub" (Google ID) in the JWT
      if (account?.provider === "google" && profile && "sub" in profile) {
        token.googleSub = (profile as any).sub;
        // keep email in token only for admin checks if you want (not stored in DB)
        if ("email" in profile) token.email = (profile as any).email;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).googleSub = (token as any).googleSub;
      (session as any).email = (token as any).email;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
});
