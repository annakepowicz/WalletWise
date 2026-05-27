"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createShoppingList(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name?.trim()) return { error: "Podaj nazwę listy" };

  const user = await db.user.findFirst();
  if (!user) return { error: "Brak użytkownika" };

  await db.shoppingList.create({
    data: { name: name.trim(), userId: user.id },
  });

  revalidatePath("/shopping-list");
  return { success: true };
}

export async function addShoppingItem(listId: string, name: string) {
  if (!name?.trim()) return { error: "Podaj nazwę produktu" };

  await db.shoppingListItem.create({
    data: { name: name.trim(), listId },
  });

  revalidatePath("/shopping-list");
  return { success: true };
}

export async function toggleShoppingItem(itemId: string, isChecked: boolean) {
  await db.shoppingListItem.update({
    where: { id: itemId },
    data: { isChecked },
  });

  revalidatePath("/shopping-list");
}

export async function deleteShoppingItem(itemId: string) {
  await db.shoppingListItem.delete({ where: { id: itemId } });
  revalidatePath("/shopping-list");
}

export async function deleteShoppingList(listId: string) {
  await db.shoppingList.delete({ where: { id: listId } });
  revalidatePath("/shopping-list");
}

export async function addItemsFromOcr(listId: string, items: string[]) {
  await db.shoppingListItem.createMany({
    data: items.map((name) => ({ name: name.trim(), listId })),
  });
  revalidatePath("/shopping-list");
}
