"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type SaveReceiptInput = {
  description: string;
  amount: number;
  date: string;
  categoryId?: string;
};

export async function saveReceiptTransaction(data: SaveReceiptInput) {
  const user = await db.user.findFirst();
  if (!user) return { error: "Brak użytkownika" };

  const categories = await db.category.findMany({ where: { userId: user.id } });

  let categoryId = data.categoryId ?? null;
  if (!categoryId && categories.length > 0) {
    const other = categories.find((c) => c.name === "Inne");
    categoryId = other ? other.id : categories[0].id;
  }

  try {
    await db.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          amount: data.amount,
          description: data.description,
          type: "EXPENSE",
          date: new Date(data.date),
          userId: user.id,
          categoryId,
          isAiCategorized: false,
        },
      });

      const account = await tx.account.findFirst({ where: { userId: user.id } });
      if (account) {
        await tx.account.update({
          where: { id: account.id },
          data: { balance: { decrement: data.amount } },
        });
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Błąd zapisu paragonu:", e);
    return { error: "Wystąpił błąd podczas zapisu transakcji" };
  }
}

export async function getCategories() {
  const user = await db.user.findFirst();
  if (!user) return [];
  return db.category.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } });
}