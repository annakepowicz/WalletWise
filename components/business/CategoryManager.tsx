"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Settings,
  X,
  Plus,
  Pencil,
  Trash2,
  Check,
  Tag,
  Loader2,
} from "lucide-react";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} from "@/app/actions/category";

type Category = {
  id: string;
  name: string;
  monthlyLimit: number;
  isRolloverEnabled: boolean;
  aiKeywords: string[];
};

export function CategoryManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formName, setFormName] = useState("");
  const [formLimit, setFormLimit] = useState("");
  const [formRollover, setFormRollover] = useState(false);
  const [formKeywords, setFormKeywords] = useState("");

  useEffect(() => {
    if (isOpen) loadCategories();
  }, [isOpen]);

  const loadCategories = async () => {
    const cats = await getCategories();
    setCategories(cats);
  };

  const resetForm = () => {
    setFormName("");
    setFormLimit("");
    setFormRollover(false);
    setFormKeywords("");
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormLimit(cat.monthlyLimit.toString());
    setFormRollover(cat.isRolloverEnabled);
    setFormKeywords(cat.aiKeywords.join(", "));
    setIsAdding(false);
  };

  const startAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", formName);
    formData.set("monthlyLimit", formLimit || "0");
    formData.set("isRolloverEnabled", formRollover.toString());
    formData.set("keywords", formKeywords);

    startTransition(async () => {
      if (editingId) {
        formData.set("id", editingId);
        await updateCategory(formData);
      } else {
        await addCategory(formData);
      }
      await loadCategories();
      resetForm();
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tę kategorię?")) return;
    startTransition(async () => {
      await deleteCategory(id);
      await loadCategories();
    });
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Settings className="h-4 w-4" />
        Zarządzaj kategoriami
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-600" />
              Zarządzanie kategoriami
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 overflow-y-auto flex-1">
          {(isAdding || editingId) && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 p-4 bg-gray-50 rounded-lg border"
            >
              <h3 className="font-semibold mb-4">
                {editingId ? "Edytuj kategorię" : "Nowa kategoria"}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Nazwa
                  </label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="np. Zakupy"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Limit miesięczny (PLN)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formLimit}
                    onChange={(e) => setFormLimit(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Słowa kluczowe (oddzielone przecinkami)
                  </label>
                  <Input
                    value={formKeywords}
                    onChange={(e) => setFormKeywords(e.target.value)}
                    placeholder="np. sklep, market, zakupy"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rollover"
                    checked={formRollover}
                    onChange={(e) => setFormRollover(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="rollover" className="text-sm text-gray-600">
                    Przenieś niewykorzystany limit na następny miesiąc
                  </label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  {editingId ? "Zapisz zmiany" : "Dodaj kategorię"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Anuluj
                </Button>
              </div>
            </form>
          )}

          {!isAdding && !editingId && (
            <Button
              onClick={startAdd}
              variant="outline"
              className="mb-4 w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Dodaj nową kategorię
            </Button>
          )}

          <div className="space-y-2">
            {categories.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Brak kategorii. Dodaj pierwszą kategorię powyżej.
              </p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    editingId === cat.id
                      ? "bg-purple-50 border-purple-200"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-sm text-gray-500 flex flex-wrap gap-2">
                      {cat.monthlyLimit > 0 && (
                        <span>Limit: {cat.monthlyLimit} zł</span>
                      )}
                      {cat.isRolloverEnabled && (
                        <span className="text-blue-600">• Rollover</span>
                      )}
                      {cat.aiKeywords.length > 0 && (
                        <span className="text-gray-400">
                          • {cat.aiKeywords.slice(0, 3).join(", ")}
                          {cat.aiKeywords.length > 3 && "..."}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(cat)}
                      disabled={isPending}
                    >
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cat.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
