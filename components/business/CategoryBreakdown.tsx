"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, ChevronLeft, ChevronRight } from "lucide-react";
import { ExpensesChart } from "./ExpensesChart";

type Transaction = {
  id: string;
  amount: number;
  type: string;
  date: string;
  categoryName: string | null;
};

type CategoryBreakdownProps = {
  transactions: Transaction[];
};

const MONTH_NAMES = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

export function CategoryBreakdown({ transactions }: CategoryBreakdownProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthTransactions = transactions.filter((tx) => {
    const date = new Date(tx.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  const categoryExpenses = new Map<string, number>();
  monthTransactions
    .filter((tx) => tx.type === "EXPENSE")
    .forEach((tx) => {
      const catName = tx.categoryName || "Bez kategorii";
      categoryExpenses.set(
        catName,
        (categoryExpenses.get(catName) || 0) + tx.amount
      );
    });

  const chartData = Array.from(categoryExpenses.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const totalExpenses = chartData.reduce((sum, cat) => sum + cat.value, 0);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const isCurrentMonth =
    currentMonth === today.getMonth() && currentYear === today.getFullYear();
  const hasData = chartData.length > 0;

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            Wydatki wg kategorii
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              disabled={isCurrentMonth}
              className="min-w-[100px]"
            >
              {isCurrentMonth ? "Dziś" : "Obecny"}
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </p>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <>
            <ExpensesChart data={chartData} />
            <div className="mt-4 space-y-2">
              {chartData.map((cat) => {
                const percentage = ((cat.value / totalExpenses) * 100).toFixed(
                  1
                );
                return (
                  <div
                    key={cat.name}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">
                        ({percentage}%)
                      </span>
                      <span className="font-mono font-medium">
                        {cat.value.toFixed(2)} zł
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                <span>Razem</span>
                <span className="font-mono">{totalExpenses.toFixed(2)} zł</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-center py-10">
            Brak wydatków w {MONTH_NAMES[currentMonth]} {currentYear}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
