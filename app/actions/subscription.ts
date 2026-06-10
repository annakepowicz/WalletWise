"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateSubscription(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const day = parseInt(formData.get("day") as string);
  const startDateStr = formData.get("startDate") as string;

  if (!id || !name || isNaN(amount) || isNaN(day)) {
    return { error: "Nieprawidłowe dane" };
  }

  if (day < 1 || day > 31) {
    return { error: "Dzień musi być między 1 a 31" };
  }

  let startDate: Date | undefined;
  if (startDateStr) {
    const [year, month] = startDateStr.split("-").map(Number);
    startDate = new Date(year, month - 1, 1);
  }

  await db.subscription.update({
    where: { id },
    data: {
      providerName: name,
      amount,
      billingDay: day,
      ...(startDate && { startDate }),
    },
  });

  revalidatePath("/calendar");
  return { success: true };
}

export async function deleteSubscription(id: string) {
  if (!id) {
    return { error: "Brak ID subskrypcji" };
  }

  await db.subscription.delete({
    where: { id },
  });

  revalidatePath("/calendar");
  return { success: true };
}
