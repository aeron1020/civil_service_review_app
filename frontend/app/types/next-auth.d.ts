// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    access?: string;
    refresh?: string;
  }

  interface JWT extends DefaultJWT {
    access?: string;
    refresh?: string;
  }
}
