import { getCurrentAppUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { SmartInput } from "@/components/business/SmartInput";
import { TransactionItem } from "@/components/business/TransactionItem";
import { ExpensesChart } from "@/components/business/ExpensesChart";
import { CategoryManager } from "@/components/business/CategoryManager";
import { ExportButton } from "@/components/business/ExportButton";

export default async function Home() {
  const user = await getCurrentAppUser({
    include: {
      walletAccounts: true,
      categories: { include: { transactions: true } },
      transactions: {
        take: 5,
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

  const account = user.walletAccounts.length > 0 ? user.walletAccounts[0] : null;

  const chartData = user.categories
    .map((cat) => {
      const value = cat.transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      return { name: cat.name, value };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalExpenses = await db.transaction
    .aggregate({
      where: { userId: user.id, type: "EXPENSE" },
      _sum: { amount: true },
    })
    .then((res) => Number(res._sum.amount || 0));

  const totalIncome = await db.transaction
    .aggregate({
      where: { userId: user.id, type: "INCOME" },
      _sum: { amount: true },
    })
    .then((res) => Number(res._sum.amount || 0));

  return (
    <main className="max-w-7xl mx-auto px-4 pb-8">
      <header className="mb-8 mt-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500">Przegląd Twoich finansów osobistych</p>
        </div>
        <ExportButton />
      </header>

      <SmartInput />

      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-linear-to-br from-blue-600 to-indigo-700 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-100 text-sm font-medium flex items-center justify-between">
                <span>Dostępne środki</span>
                <Wallet className="h-4 w-4 opacity-70" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tight">
                {account ? Number(account.balance).toFixed(2) : "0.00"}{" "}
                <span className="text-xl font-normal opacity-70">PLN</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-green-50 border-green-100 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase mb-1">
                  <ArrowUpRight className="h-4 w-4" /> Wpływy
                </div>
                <div className="text-lg font-bold text-green-700">
                  {totalIncome.toFixed(0)} zł
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-100 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase mb-1">
                  <ArrowDownRight className="h-4 w-4" /> Wydatki
                </div>
                <div className="text-lg font-bold text-red-700">
                  {totalExpenses.toFixed(0)} zł
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" /> Struktura
                  wydatków
                </CardTitle>
                <CategoryManager />
              </div>
            </CardHeader>
            <CardContent>
              <ExpensesChart data={chartData} />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full border shadow-sm">
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle>Ostatnie operacje</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {user.transactions.length === 0 ? (
                  <p className="text-gray-400 text-center py-10">
                    Brak transakcji.
                  </p>
                ) : (
                  user.transactions.map((tx) => (
                    <TransactionItem
                      key={tx.id}
                      tx={{
                        id: tx.id,
                        description: tx.description,
                        amount: Number(tx.amount),
                        date: tx.date,
                        type: tx.type,
                        categoryName: tx.category?.name,
                      }}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
