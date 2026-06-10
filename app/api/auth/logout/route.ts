import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  const idToken = session?.user?.idToken;
  const issuer = process.env.KEYCLOAK_ISSUER;
  const loginUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/login`;

  const keycloakLogout =
    idToken && issuer
      ? `${issuer}/protocol/openid-connect/logout?id_token_hint=${encodeURIComponent(idToken)}&post_logout_redirect_uri=${encodeURIComponent(loginUrl)}`
      : loginUrl;

  const response = NextResponse.redirect(keycloakLogout);
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");
  return response;
}
