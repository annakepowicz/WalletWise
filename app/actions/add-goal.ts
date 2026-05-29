"use server";
import { db } from "@/lib/db";
import { getCurrentAppUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addGoal(formData: FormData) {
  const name = formData.get("name") as string;
  const target = parseFloat(formData.get("target") as string);
  const deadlineStr = formData.get("deadline") as string;
  const monthlyTargetStr = formData.get("monthlyTarget") as string;
  const monthlyTarget = monthlyTargetStr ? parseFloat(monthlyTargetStr) : null;

  const user = await getCurrentAppUser();
  if (!user) return;

  await db.savingsGoal.create({
    data: {
      name,
      targetAmount: target,
      currentAmount: 0,
      monthlyTarget,
      deadline: deadlineStr ? new Date(deadlineStr) : null,
      userId: user.id,
    },
  });

  revalidatePath("/goals");
}

export async function addFundsToGoal(goalId: string, amount: number) {
  await db.savingsGoal.update({
    where: { id: goalId },
    data: { currentAmount: { increment: amount } },
  });

  revalidatePath("/goals");
  revalidatePath("/");
}

export async function deleteGoal(goalId: string) {
  await db.savingsGoal.delete({
    where: { id: goalId },
  });

  revalidatePath("/goals");
  return { success: true };
}

export async function archiveGoal(goalId: string) {
  await db.savingsGoal.update({
    where: { id: goalId },
    data: { isArchived: true },
  });

  revalidatePath("/goals");
  return { success: true };
}

export async function unarchiveGoal(goalId: string) {
  await db.savingsGoal.update({
    where: { id: goalId },
    data: { isArchived: false },
  });

  revalidatePath("/goals");
  return { success: true };
}
