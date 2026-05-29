"use server";

import { db } from "@/lib/db";
import { getCurrentAppUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const monthlyLimit = parseFloat(formData.get("monthlyLimit") as string) || 0;
  const isRolloverEnabled = formData.get("isRolloverEnabled") === "true";
  const keywordsStr = formData.get("keywords") as string;
  const keywords = keywordsStr
    ? keywordsStr.split(",").map((k) => k.trim().toLowerCase())
    : [];

  const user = await getCurrentAppUser();
  if (!user) return { error: "Brak użytkownika" };

  const existing = await db.category.findFirst({
    where: { userId: user.id, name },
  });
  if (existing) {
    return { error: "Kategoria o tej nazwie już istnieje" };
  }

  await db.category.create({
    data: {
      name,
      monthlyLimit,
      isRolloverEnabled,
      aiKeywords: keywords,
      userId: user.id,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const monthlyLimit = parseFloat(formData.get("monthlyLimit") as string) || 0;
  const isRolloverEnabled = formData.get("isRolloverEnabled") === "true";
  const keywordsStr = formData.get("keywords") as string;
  const keywords = keywordsStr
    ? keywordsStr.split(",").map((k) => k.trim().toLowerCase())
    : [];

  const user = await getCurrentAppUser();
  if (!user) return { error: "Brak użytkownika" };

  const existing = await db.category.findFirst({
    where: { userId: user.id, name, NOT: { id } },
  });
  if (existing) {
    return { error: "Kategoria o tej nazwie już istnieje" };
  }

  await db.category.update({
    where: { id },
    data: {
      name,
      monthlyLimit,
      isRolloverEnabled,
      aiKeywords: keywords,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const user = await getCurrentAppUser();
  if (!user) return { error: "Brak użytkownika" };

  
  await db.transaction.updateMany({
    where: { categoryId: id },
    data: { categoryId: null },
  });

  await db.category.delete({
    where: { id },
  });

  revalidatePath("/");
  return { success: true };
}

export async function getCategories() {
  const user = await getCurrentAppUser();
  if (!user) return [];

  const categories = await db.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    monthlyLimit: Number(cat.monthlyLimit),
    isRolloverEnabled: cat.isRolloverEnabled,
    aiKeywords: cat.aiKeywords,
  }));
}
