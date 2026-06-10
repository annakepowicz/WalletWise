import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

type Goal = {
  id: string;
  name: string;
  targetAmount: any;
  currentAmount: any;
  deadline: Date | null;
};

export function SinkingFundsList({ goals }: { goals: Goal[] }) {
  const calculateMonthly = (
    target: number,
    current: number,
    deadline: Date
  ) => {
    const now = new Date();
    const monthsLeft =
      (deadline.getFullYear() - now.getFullYear()) * 12 +
      (deadline.getMonth() - now.getMonth());

    if (monthsLeft <= 0) return 0;

    const remaining = target - current;
    return remaining / monthsLeft;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
          <Target className="h-4 w-4" />
          Cele i Amortyzacja
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.length === 0 && (
          <p className="text-sm text-gray-500">Brak aktywnych celów.</p>
        )}

        {goals.map((goal) => {
          const target = Number(goal.targetAmount);
          const current = Number(goal.currentAmount);
          const percentage = Math.min(
            100,
            Math.round((current / target) * 100)
          );

          let monthlySuggestion = null;
          if (goal.deadline) {
            const amount = calculateMonthly(target, current, goal.deadline);
            if (amount > 0) {
              monthlySuggestion = amount.toFixed(0);
            }
          }

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{goal.name}</span>
                <span className="text-gray-500">
                  {current} / {target} PLN
                </span>
              </div>

              <Progress value={percentage} className="h-2" />

              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-600 font-medium">{percentage}%</span>

                {/* Logika wyświetlania porady */}
                {goal.deadline ? (
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    Amortyzacja: {monthlySuggestion} PLN / mc
                  </span>
                ) : (
                  <span className="text-gray-400">Skarbonka (bez terminu)</span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
