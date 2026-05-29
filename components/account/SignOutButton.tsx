"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

async function handleSignOut() {
  await signOut({ redirect: false });
  window.location.href = "/api/auth/logout";
}

export function SignOutButton() {
  return (
    <Button
      type="button"
      className="bg-red-600 hover:bg-red-700"
      onClick={handleSignOut}
    >
      Wyloguj się
    </Button>
  );
}