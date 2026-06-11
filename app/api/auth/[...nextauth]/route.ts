import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";
import { createAuthAdapter } from "@/lib/auth-adapter";

export const authOptions: NextAuthOptions = {
  adapter: createAuthAdapter(),
  session: {
    strategy: "jwt",
  },
providers: [
    // TUTAJ WSTAWIAMY CHAMSKIEGO PROVIDERA ZAMIAST KeycloakProvider()
    {
      id: "keycloak",
      name: "Keycloak",
      type: "oauth",
      version: "2.0",
      clientId: process.env.KEYCLOAK_CLIENT_ID || "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
      issuer: "http://localhost:8080/realms/walletwise",
      authorization: {
        url: "http://localhost:8080/realms/walletwise/protocol/openid-connect/auth",
        params: { scope: "openid email profile" }
      },
      token: "http://keycloak:8080/realms/walletwise/protocol/openid-connect/token",
      userinfo: "http://keycloak:8080/realms/walletwise/protocol/openid-connect/userinfo",
      jwks_endpoint: "http://keycloak:8080/realms/walletwise/protocol/openid-connect/certs",
      
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
        }
      },
    }
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: any; account?: any }) {
      if (account) {
        token.id = user?.id;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string | undefined;
        (session.user as any).idToken = token.idToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
