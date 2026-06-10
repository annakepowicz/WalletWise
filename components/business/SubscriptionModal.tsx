"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { X, Save, Trash2, Loader2, CreditCard } from "lucide-react";
import {
  updateSubscription,
  deleteSubscription,
} from "@/app/actions/subscription";

type Subscription = {
  id: string;
  providerName: string;
  amount: number;
  billingDay: number;
  startDate: string;
};

type SubscriptionModalProps = {
  subscription: Subscription;
  onClose: () => void;
};

export function SubscriptionModal({
  subscription,
  onClose,
}: SubscriptionModalProps) {
  const [name, setName] = useState(subscription.providerName);
  const [amount, setAmount] = useState(subscription.amount.toString());
  const [day, setDay] = useState(subscription.billingDay.toString());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const startDateObj = new Date(subscription.startDate);
  const formattedStartDate = `${startDateObj.getFullYear()}-${String(
    startDateObj.getMonth() + 1
  ).padStart(2, "0")}`;
  const [startDate, setStartDate] = useState(formattedStartDate);

  const [isPending, startTransition] = useTransition();

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("id", subscription.id);
    formData.set("name", name);
    formData.set("amount", amount);
    formData.set("day", day);
    formData.set("startDate", startDate);

    startTransition(async () => {
      await updateSubscription(formData);
      onClose();
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteSubscription(subscription.id);
      onClose();
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Edytuj subskrypcję
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Nazwa usługi
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="np. Netflix"
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Kwota (PLN)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Dzień miesiąca
                </label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="1-31"
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Od kiedy (miesiąc)
                </label>
                <Input
                  type="month"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  disabled={isPending}
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Subskrypcja będzie widoczna od wybranego miesiąca
                </p>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Zapisz zmiany
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Usuń subskrypcję"
        message={`Czy na pewno chcesz usunąć subskrypcję "${
          subscription.providerName
        }" (${subscription.amount.toFixed(
          2
        )} PLN/mies.)? Ta operacja jest nieodwracalna.`}
        confirmText="Usuń"
        variant="danger"
      />
    </>
  );
}
