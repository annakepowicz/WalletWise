"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      type="button"
      className="bg-red-600 hover:bg-red-700"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Wyloguj się
    </Button>
  );
}
