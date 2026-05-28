"use client";

import { useState } from "react";
import { deleteTransaction } from "@/app/actions/delete-transaction";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ArrowDownIcon, ArrowUpIcon, Trash2 } from "lucide-react";
import { useTransition } from "react";

type TransactionProps = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  type: string;
  categoryName?: string;
};

export function TransactionItem({ tx }: { tx: TransactionProps }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTransaction(tx.id);
    });
  };

  return (
    <>
      <div
        className={`flex items-center justify-between border-b pb-3 last:border-0 transition-opacity ${
          isPending ? "opacity-50" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-2 rounded-full ${
              tx.type === "INCOME"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {tx.type === "INCOME" ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
          </div>

          <div>
            <p className="font-medium text-sm">{tx.description}</p>
            <p className="text-xs text-gray-500">
              {tx.categoryName || "Bez kategorii"} •{" "}
              {tx.date.toLocaleDateString("pl-PL")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`font-bold text-sm ${
              tx.type === "INCOME" ? "text-green-600" : "text-gray-900"
            }`}
          >
            {tx.type === "INCOME" ? "+" : "-"}
            {tx.amount.toFixed(2)} PLN
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
            onClick={() => setShowConfirm(true)}
            disabled={isPending}
            title="Usuń transakcję"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Usuń transakcję"
        message={`Czy na pewno chcesz usunąć transakcję "${
          tx.description
        }" (${tx.amount.toFixed(2)} PLN)? Ta operacja jest nieodwracalna.`}
        confirmText="Usuń"
        variant="danger"
      />
    </>
  );
}
