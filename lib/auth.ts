import { getServerSession } from "next-auth";
import { Prisma, User } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function getCurrentAuthSession() {
  return getServerSession(authOptions);
}

export async function getCurrentAppUser(options?: { include?: Prisma.UserInclude }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({ where: { id: session.user.id }, ...options });
  return user as User | (User & { [key: string]: any }) | null;
}
