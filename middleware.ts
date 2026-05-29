import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy() {
    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (token) return true;
        const sessionCookie =
          req.cookies.get("next-auth.session-token") ||
          req.cookies.get("__Secure-next-auth.session-token");
        return !!sessionCookie;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api/auth|_next|.*\\..*|login).*)"],
};
