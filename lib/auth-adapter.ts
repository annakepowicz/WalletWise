import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Adapter, AdapterAccount } from "next-auth/adapters";
import { db } from "@/lib/db";

/** Keycloak token response uses `not-before-policy`; Prisma expects `not_before_policy`. */
function normalizeKeycloakAccount(account: AdapterAccount): AdapterAccount {
  const raw = account as AdapterAccount & { "not-before-policy"?: number };
  if (raw["not-before-policy"] === undefined) {
    return account;
  }
  const { "not-before-policy": notBeforePolicy, ...rest } = raw;
  return { ...rest, not_before_policy: notBeforePolicy } as AdapterAccount;
}

export function createAuthAdapter(): Adapter {
  const base = PrismaAdapter(db);
  return {
    ...base,
    linkAccount: (account) =>
      base.linkAccount!(normalizeKeycloakAccount(account)),
  };
}
