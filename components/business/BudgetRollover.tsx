import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank } from "lucide-react";

type CategoryWithStats = {
  id: string;
  name: string;
  monthlyLimit: number;
  spentThisMonth: number;
  isRolloverEnabled: boolean;
  rolloverAmount: number;
};

export function BudgetRollover({
  categories,
}: {
  categories: CategoryWithStats[];
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
          <PiggyBank className="h-4 w-4" />
          Budżety i Rollover
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((cat) => {
          // Całkowity budżet = Limit + Przeniesione
          const totalBudget = cat.monthlyLimit + cat.rolloverAmount;
          const percentage = Math.min(
            100,
            (cat.spentThisMonth / totalBudget) * 100
          );
          const remaining = totalBudget - cat.spentThisMonth;

          return (
            <div key={cat.id} className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-medium text-sm">{cat.name}</p>
                  <p className="text-xs text-gray-500">
                    Limit: {cat.monthlyLimit}
                    {cat.isRolloverEnabled && cat.rolloverAmount > 0 && (
                      <span className="text-green-600 font-semibold ml-1">
                        + {cat.rolloverAmount} (z zeszłego msc)
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">
                    {remaining.toFixed(2)} PLN
                  </p>
                  <p className="text-xs text-gray-400">pozostało</p>
                </div>
              </div>

              <Progress
                value={percentage}
                className={`h-2 ${remaining < 0 ? "bg-red-100" : ""}`}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
