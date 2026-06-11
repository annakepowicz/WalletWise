"use server";
import { db } from "@/lib/db";
import { getCurrentAppUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addSubscription(formData: FormData) {
  const name = formData.get("name") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const day = parseInt(formData.get("day") as string);
  const startDateStr = formData.get("startDate") as string;

  const user = await getCurrentAppUser();
  if (!user) return;

  let startDate: Date;
  if (startDateStr) {
    const [year, month] = startDateStr.split("-").map(Number);
    startDate = new Date(year, month - 1, 1);
  } else {
    const now = new Date();
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  await db.subscription.create({
    data: {
      providerName: name,
      amount,
      billingDay: day,
      startDate,
      userId: user.id,
    },
  });

  revalidatePath("/calendar");
}
