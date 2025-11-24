// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  // cookies: {
  //   sessionToken: {
  //     name: "__Secure-next-auth.session-token",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax", // "lax" works for localhost, "none" + secure for prod
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  // },
  callbacks: {
    // Only allow Google sign-ins
    async signIn({ account }) {
      return account?.provider === "google";
    },

    // Store access & refresh tokens in JWT
    async jwt({ token, account }) {
      if (account?.accessToken) token.access = account.accessToken;
      if (account?.refreshToken) token.refresh = account.refreshToken;
      return token;
    },

    // Make access & refresh tokens available in session
    async session({ session, token }) {
      return {
        ...session,
        access: token.access,
        refresh: token.refresh,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
