"use server";

import { db } from "@/lib/db";
import { getCurrentAppUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TransactionSchema = z.object({
  input: z.string().min(3, "Wpisz co najmniej opis i kwotę"),
});

export async function addSmartTransaction(formData: FormData) {
  const rawInput = formData.get("smartInput");

  const result = TransactionSchema.safeParse({ input: rawInput });
  if (!result.success) {
    return { error: "Błędne dane wejściowe" };
  }

  const text = result.data.input;

  const amountMatch = text.match(/(\d+[.,]?\d*)/);
  if (!amountMatch) {
    return { error: "Nie znaleziono kwoty! Wpisz np. 'Kino 50'" };
  }

  const amount = parseFloat(amountMatch[0].replace(",", "."));
  const description = text.replace(amountMatch[0], "").trim();
  if (!description) return { error: "Podaj opis transakcji" };

  const user = await getCurrentAppUser();
  if (!user) return { error: "Brak użytkownika" };

  // Słowa kluczowe identyfikujące przychód
  const incomeKeywords = [
    "wypłata",
    "wyplata",
    "przelew",
    "zwrot",
    "wpływ",
    "wplyw",
    "nagroda",
    "premia",
    "sprzedaż",
    "sprzedaz",
    "przychód",
    "przychod",
    "doładowanie",
    "doladowanie",
    "pensja",
    "freelance",
    "odsetki",
    "dywidenda",
    "wynagrodzenie",
    "zarobek",
    "zysk",
    "dotacja",
    "stypendium",
    "alimenty",
    "renta",
    "emerytura",
    "zasiłek",
    "zasilek",
    "bonus",
    "cashback",
  ];

  const isIncome = incomeKeywords.some((keyword) =>
    description.toLowerCase().includes(keyword)
  );

  let selectedCategoryId = null;
  let isAiCategorized = false;

  // Automatyczne przypisanie kategorii dla wydatków
  if (!isIncome) {
    const categories = await db.category.findMany({
      where: { userId: user.id },
    });

    for (const cat of categories) {
      const keywords = cat.aiKeywords || [];
      if (
        keywords.some((k) =>
          description.toLowerCase().includes(k.toLowerCase())
        )
      ) {
        selectedCategoryId = cat.id;
        isAiCategorized = true;
        break;
      }
    }

    // Fallback do kategorii "Inne"
    if (!selectedCategoryId && categories.length > 0) {
      const otherCat = categories.find((c) => c.name === "Inne");
      selectedCategoryId = otherCat ? otherCat.id : categories[0].id;
    }
  }

  // Transakcja ACID: zapis + aktualizacja salda
  try {
    await db.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          amount,
          description:
            description.charAt(0).toUpperCase() + description.slice(1),
          type: isIncome ? "INCOME" : "EXPENSE",
          date: new Date(),
          userId: user.id,
          categoryId: selectedCategoryId,
          isAiCategorized,
        },
      });

      const account = await tx.appAccount.findFirst({
        where: { userId: user.id },
      });

      if (account) {
        await tx.appAccount.update({
          where: { id: account.id },
          data: {
            balance: isIncome ? { increment: amount } : { decrement: amount },
          },
        });
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Błąd zapisu transakcji:", e);
    return { error: "Wystąpił błąd bazy danych" };
  }
}
