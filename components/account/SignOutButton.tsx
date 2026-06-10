"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="shrink-0 gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
      onClick={() => {
        window.location.href = "/api/auth/logout";
      }}
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Wyloguj</span>
    </Button>
  );
}