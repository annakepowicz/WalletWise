"use server";

import { db } from "@/lib/db";
import { getCurrentAppUser } from "@/lib/auth";

export async function exportTransactionsToCSV(): Promise<{
  success: boolean;
  data?: string;
  filename?: string;
  error?: string;
}> {
  try {
    const user = await getCurrentAppUser();
    if (!user) {
      return { success: false, error: "Brak użytkownika" };
    }

    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    if (transactions.length === 0) {
      return { success: false, error: "Brak transakcji do eksportu" };
    }

    const headers = ["Data", "Opis", "Kwota", "Typ", "Kategoria"];

    const rows = transactions.map((tx) => {
      const d = tx.date;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const date = `${day}.${month}.${year}`;

      const description = `"${tx.description.replace(/"/g, '""')}"`;
      const amount = Number(tx.amount).toFixed(2).replace(".", ",");
      const type = tx.type === "INCOME" ? "Przychód" : "Wydatek";
      const category = tx.category?.name || "Bez kategorii";

      return [date, description, amount, type, category].join(";");
    });

    const csvContent = [headers.join(";"), ...rows].join("\n");

    const csvWithBOM = "\uFEFF" + csvContent;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const filename = `walletwise-transakcje-${todayStr}.csv`;

    return {
      success: true,
      data: csvWithBOM,
      filename,
    };
  } catch (error) {
    console.error("Błąd eksportu CSV:", error);
    return { success: false, error: "Wystąpił błąd podczas eksportu" };
  }
}
