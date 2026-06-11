import { getCurrentAppUser } from "@/lib/auth";
import { buildCategoryBudgetStats } from "@/lib/budget-stats";
import { CategoryBreakdown } from "@/components/business/CategoryBreakdown";
import { BudgetRollover } from "@/components/business/BudgetRollover";
import { BarChart3 } from "lucide-react";

export default async function ChartsPage() {
  const user = await getCurrentAppUser({
    include: {
      categories: true,
      transactions: {
        orderBy: { date: "desc" },
        include: { category: true },
      },
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

  const transactions = user.transactions.map((tx) => ({
    id: tx.id,
    amount: Number(tx.amount),
    type: tx.type,
    date: tx.date.toISOString(),
    categoryName: tx.category?.name ?? null,
  }));

  const budgetStats = buildCategoryBudgetStats(
    user.categories,
    user.transactions
  );

  return (
    <main className="max-w-6xl mx-auto px-4 pb-12">
      <header className="mb-8 mt-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Wykresy
          </h1>
          <p className="text-gray-500">
            Analiza wydatków według kategorii i wykorzystanie budżetów
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryBreakdown transactions={transactions} />
        <BudgetRollover categories={budgetStats} />
      </div>
    </main>
  );
}
