"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Trash2, Archive, RotateCcw, Loader2 } from "lucide-react";
import { deleteGoal, archiveGoal, unarchiveGoal } from "@/app/actions/add-goal";

type GoalActionsProps = {
  goalId: string;
  goalName: string;
  isCompleted: boolean;
  isArchived: boolean;
};

export function GoalActions({
  goalId,
  goalName,
  isCompleted,
  isArchived,
}: GoalActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteGoal(goalId);
    });
  };

  const handleArchive = () => {
    startTransition(async () => {
      await archiveGoal(goalId);
    });
  };

  const handleUnarchive = () => {
    startTransition(async () => {
      await unarchiveGoal(goalId);
    });
  };

  return (
    <>
      <div className="flex gap-2">
        {isArchived ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleUnarchive}
            disabled={isPending}
            className="gap-1 text-blue-600 hover:text-blue-700 hover:border-blue-300"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Przywróć
          </Button>
        ) : isCompleted ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleArchive}
            disabled={isPending}
            className="gap-1 text-green-600 hover:text-green-700 hover:border-green-300"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Archive className="h-4 w-4" />
            )}
            Archiwizuj
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isPending}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Usuń cel oszczędnościowy"
        message={`Czy na pewno chcesz usunąć cel "${goalName}"? Wszystkie zgromadzone środki zostaną utracone. Ta operacja jest nieodwracalna.`}
        confirmText="Usuń cel"
        variant="danger"
      />
    </>
  );
}
