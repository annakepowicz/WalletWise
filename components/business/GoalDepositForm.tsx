"use client";

import { useState, useTransition } from "react";
import { addFundsToGoal } from "@/app/actions/add-goal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";

type GoalDepositFormProps = {
  goalId: string;
  suggestedAmount?: number;
};

export function GoalDepositForm({
  goalId,
  suggestedAmount,
}: GoalDepositFormProps) {
  const [amount, setAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;

    startTransition(async () => {
      await addFundsToGoal(goalId, value);
      setAmount("");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="number"
        step="0.01"
        min="0.01"
        placeholder={
          suggestedAmount ? suggestedAmount.toFixed(2) : "Kwota wpłaty"
        }
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-32"
        disabled={isPending}
        required
      />
      <Button type="submit" size="sm" disabled={isPending} className="gap-1">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Wpłać
      </Button>
    </form>
  );
}
