import { getCurrentAppUser } from "@/lib/auth";
import {
  FinanceCalendar,
  type CalendarEvent,
} from "@/components/business/FinanceCalendar";
import { CalendarDays } from "lucide-react";

export default async function CalendarPage() {
  const user = await getCurrentAppUser({
    include: {
      transactions: { orderBy: { date: "desc" } },
      subscriptions: true,
      savingsGoals: { where: { isArchived: false } },
    },
  });

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <div>
          <h1 className="text-xl font-bold text-red-600">Brak danych</h1>
          <p>
            Uruchom w terminalu:{" "}
            <code className="bg-gray-100 p-1">npx prisma db seed</code>
          </p>
        </div>
      </div>
    );
  }

  const transactions: CalendarEvent[] = user.transactions.map((tx) => ({
    id: `tx-${tx.id}`,
    date: tx.date.toISOString(),
    label: tx.description,
    amount: Number(tx.amount),
    kind: "transaction",
    transactionType: tx.type as "INCOME" | "EXPENSE",
  }));

  const subscriptions = user.subscriptions.map((sub) => ({
    id: sub.id,
    providerName: sub.providerName,
    amount: Number(sub.amount),
    billingDay: sub.billingDay,
  }));

  const goals: CalendarEvent[] = user.savingsGoals
    .filter((goal) => goal.deadline)
    .map((goal) => ({
      id: `goal-${goal.id}`,
      date: goal.deadline!.toISOString(),
      label: `Termin: ${goal.name}`,
      amount: Number(goal.targetAmount),
      kind: "goal",
    }));

  return (
    <main className="max-w-6xl mx-auto px-4 pb-12">
      <header className="mb-8 mt-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
          <CalendarDays className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Kalendarz
          </h1>
          <p className="text-gray-500">
            Transakcje, płatności subskrypcji i terminy celów oszczędnościowych
          </p>
        </div>
      </header>

      <FinanceCalendar
        transactions={transactions}
        subscriptions={subscriptions}
        goals={goals}
      />
    </main>
  );
}
