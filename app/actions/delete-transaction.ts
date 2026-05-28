"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteTransaction(transactionId: string) {
  try {
    const tx = await db.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!tx) return { error: "Transakcja nie istnieje" };

    // Transakcja ACID: usuń + przywróć saldo
    await db.$transaction(async (prisma) => {
      await prisma.transaction.delete({
        where: { id: transactionId },
      });

      await prisma.appAccount.updateMany({
        where: { userId: tx.userId },
        data: {
          balance:
            tx.type === "EXPENSE"
              ? { increment: tx.amount }
              : { decrement: tx.amount },
        },
      });
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Błąd usuwania:", e);
    return { error: "Wystąpił błąd" };
  }
}
