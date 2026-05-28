"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Zaloguj się do WalletWise</h1>
        <p className="mb-6 text-sm text-gray-500">
          Użyj konta Keycloak, aby uzyskać dostęp do swoich danych finansowych.
        </p>
        <Button
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => signIn("keycloak")}
        >
          Zaloguj się przez Keycloak
        </Button>
      </div>
    </main>
  );
}
