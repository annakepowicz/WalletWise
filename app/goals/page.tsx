import { getCurrentAppUser } from "@/lib/auth";
import { addGoal } from "@/app/actions/add-goal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, CalendarClock, Archive } from "lucide-react";
import { GoalDepositForm } from "@/components/business/GoalDepositForm";
import { GoalActions } from "@/components/business/GoalActions";

export default async function GoalsPage() {
  const user = await getCurrentAppUser({ include: { savingsGoals: true } });

  if (!user)
    return (
      <div className="p-8 text-center">Brak użytkownika. Uruchom seed.</div>
    );

  const activeGoals = user.savingsGoals.filter((g) => !g.isArchived);
  const archivedGoals = user.savingsGoals.filter((g) => g.isArchived);

  return (
    <main className="max-w-6xl mx-auto px-4 pb-12">
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-gray-900">Cele i Amortyzacja</h1>
        <p className="text-gray-500">
          Planuj przyszłe wydatki i realizuj marzenia
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Nowy cel</CardTitle>
              <CardDescription>Co chcesz sfinansować?</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={addGoal} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Nazwa
                  </label>
                  <Input name="name" placeholder="np. OC Samochodu" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Kwota docelowa
                  </label>
                  <Input
                    name="target"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Planowana miesięczna wpłata (opcjonalne)
                  </label>
                  <Input
                    name="monthlyTarget"
                    type="number"
                    step="0.01"
                    placeholder="np. 100.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Data zakupu
                  </label>
                  <Input name="deadline" type="date" />
                  <p className="text-[10px] text-blue-600 mt-1">
                    *Wypełnij datę dla Amortyzacji (np. opłaty roczne). Zostaw
                    puste dla Skarbonki.
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Dodaj cel
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            {activeGoals.length === 0 && archivedGoals.length === 0 && (
              <p className="text-gray-400 text-center py-10">
                Brak celów. Dodaj pierwszy formularzem po lewej.
              </p>
            )}

            {activeGoals.map((goal) => {
              const target = Number(goal.targetAmount);
              const current = Number(goal.currentAmount);
              const monthlyTarget = goal.monthlyTarget
                ? Number(goal.monthlyTarget)
                : undefined;
              const progress = Math.min(100, (current / target) * 100);
              const isAmortization = !!goal.deadline;
              const isCompleted = progress >= 100;

              return (
                <Card
                  key={goal.id}
                  className={`overflow-hidden ${
                    isCompleted ? "ring-2 ring-green-400 bg-green-50/30" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            isCompleted
                              ? "bg-green-100 text-green-600"
                              : isAmortization
                              ? "bg-purple-100 text-purple-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {isAmortization ? (
                            <CalendarClock className="h-6 w-6" />
                          ) : (
                            <PiggyBank className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">
                            {goal.name}
                            {isCompleted && (
                              <span className="ml-2 text-sm font-normal text-green-600">
                                ✓ Ukończony
                              </span>
                            )}
                          </h3>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {isAmortization
                              ? `Amortyzacja • Termin: ${goal.deadline?.toLocaleDateString()}`
                              : "Skarbonka • Dowolne wpłaty"}
                            {monthlyTarget && (
                              <span className="text-blue-600 ml-2">
                                • Plan: {monthlyTarget} zł/mies.
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {current.toFixed(2)} zł
                        </div>
                        <div className="text-sm text-gray-400">
                          z {target.toFixed(2)} zł
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <Progress
                        value={progress}
                        className={`h-3 rounded-full ${
                          isCompleted ? "[&>div]:bg-green-500" : ""
                        }`}
                      />
                      <div className="flex justify-between mt-1 text-xs font-medium text-gray-500">
                        <span>0%</span>
                        <span
                          className={
                            progress >= 100 ? "text-green-600 font-bold" : ""
                          }
                        >
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t pt-4 mt-4">
                      <GoalActions
                        goalId={goal.id}
                        goalName={goal.name}
                        isCompleted={isCompleted}
                        isArchived={false}
                      />
                      {!isCompleted && (
                        <GoalDepositForm
                          goalId={goal.id}
                          suggestedAmount={monthlyTarget}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {archivedGoals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-500 mt-8">
                <Archive className="h-5 w-5" />
                <h2 className="font-semibold">
                  Archiwum ({archivedGoals.length})
                </h2>
              </div>

              {archivedGoals.map((goal) => {
                const target = Number(goal.targetAmount);
                const current = Number(goal.currentAmount);
                const isAmortization = !!goal.deadline;

                return (
                  <Card
                    key={goal.id}
                    className="overflow-hidden bg-gray-50 opacity-75"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-200 text-gray-500">
                            {isAmortization ? (
                              <CalendarClock className="h-5 w-5" />
                            ) : (
                              <PiggyBank className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-600">
                              {goal.name}
                            </h3>
                            <p className="text-xs text-gray-400">
                              {current.toFixed(2)} / {target.toFixed(2)} zł
                            </p>
                          </div>
                        </div>
                        <GoalActions
                          goalId={goal.id}
                          goalName={goal.name}
                          isCompleted={true}
                          isArchived={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
