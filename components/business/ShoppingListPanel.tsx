"use client";

import { useState, useTransition, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Trash2, Upload, Loader2, X } from "lucide-react";
import {
  createShoppingList,
  addShoppingItem,
  toggleShoppingItem,
  deleteShoppingItem,
  deleteShoppingList,
  addItemsFromOcr,
} from "@/app/actions/shopping-list";
import { processShoppingImage } from "@/app/actions/ocr";

type Item = { id: string; name: string; isChecked: boolean };
type ShoppingList = { id: string; name: string; items: Item[] };

export function ShoppingListPanel({ lists }: { lists: ShoppingList[] }) {
  const [isPending, startTransition] = useTransition();
  const [ocrListId, setOcrListId] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [newItemInputs, setNewItemInputs] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const createFormRef = useRef<HTMLFormElement>(null);

  async function handleOcrUpload(listId: string, file: File) {
    setOcrLoading(true);
    setOcrError(null);
    const formData = new FormData();
    formData.append("image", file);
    const result = await processShoppingImage(formData);
    setOcrLoading(false);

    if (result.error) {
      setOcrError(result.error);
      return;
    }
    if (result.items && result.items.length > 0) {
      startTransition(async () => {
        await addItemsFromOcr(listId, result.items!);
      });
    }
    setOcrListId(null);
  }

  function handleAddItem(listId: string) {
    const name = newItemInputs[listId]?.trim();
    if (!name) return;
    startTransition(async () => {
      await addShoppingItem(listId, name);
      setNewItemInputs((prev) => ({ ...prev, [listId]: "" }));
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Lewa kolumna: formularz nowej listy */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Nowa lista</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              ref={createFormRef}
              action={async (formData) => {
                await createShoppingList(formData);
                createFormRef.current?.reset();
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Nazwa listy
                </label>
                <Input
                  name="name"
                  placeholder="np. Biedronka, Rossmann, Impreza rodzinna..."
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Utwórz listę
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs font-bold uppercase text-gray-500 mb-2">
                Jak wgrać liste zakupów ze zdjecia?
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Utwórz listę, a następnie kliknij przycisk{" "}
                <span className="font-medium text-purple-600">Wgraj listę ze zdjęcia</span> przy
                wybranej liście. Zrób zdjęcie swojej ręcznie napisanej/wydrukowanej listy lub paragonu —
                zostanie ona odczytana i produkty zostaną dodane automatycznie.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prawa kolumna: listy zakupów */}
      <div className="lg:col-span-2 space-y-6">
        {lists.length === 0 && (
          <p className="text-gray-400 text-center py-16">
            Brak list zakupów. Utwórz pierwszą formularzem po lewej.
          </p>
        )}

        {lists.map((list) => {
          const checkedCount = list.items.filter((i) => i.isChecked).length;
          const totalCount = list.items.length;
          const isOcrOpen = ocrListId === list.id;

          return (
            <Card key={list.id} className="overflow-hidden">
              <CardHeader className="border-b bg-gray-50/50 py-3 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{list.name}</CardTitle>
                      {totalCount > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {checkedCount}/{totalCount} zaznaczonych
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      onClick={() =>
                        setOcrListId(isOcrOpen ? null : list.id)
                      }
                    >
                      <Upload className="h-3.5 w-3.5 mr-1" />
                      Wgraj listę ze zdjęcia
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() =>
                        startTransition(() => deleteShoppingList(list.id))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 px-5 pb-5">
                {/* Panel OCR */}
                {isOcrOpen && (
                  <div className="mb-4 p-4 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50/50">
                    <p className="text-sm font-semibold text-purple-700 mb-1 flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Załaduj zdjęcie listy
                    </p>

                    {ocrLoading ? (
                      <div className="flex items-center gap-2 text-purple-600 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analizuję zdjęcie...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={(el) => {
                            fileInputRefs.current[list.id] = el;
                          }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleOcrUpload(list.id, file);
                          }}
                        />
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() =>
                            fileInputRefs.current[list.id]?.click()
                          }
                        >
                          Wybierz zdjęcie
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setOcrListId(null);
                            setOcrError(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {ocrError && (
                      <p className="text-red-500 text-xs mt-2">{ocrError}</p>
                    )}
                  </div>
                )}

                {/* Lista produktów */}
                <div className="space-y-1.5">
                  {list.items.length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-4">
                      Lista pusta — dodaj produkty poniżej lub wgraj zdjęcie.
                    </p>
                  )}
                  {list.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        item.isChecked
                          ? "bg-green-50"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={(e) =>
                          startTransition(() =>
                            toggleShoppingItem(item.id, e.target.checked)
                          )
                        }
                        className="h-4 w-4 rounded accent-blue-600 cursor-pointer flex-shrink-0"
                      />
                      <span
                        className={`flex-1 text-sm ${
                          item.isChecked
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {item.name}
                      </span>
                      <button
                        onClick={() =>
                          startTransition(() => deleteShoppingItem(item.id))
                        }
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Inline dodawanie produktu */}
                <div className="flex gap-2 mt-3">
                  <Input
                    placeholder="Dodaj produkt..."
                    value={newItemInputs[list.id] || ""}
                    onChange={(e) =>
                      setNewItemInputs((prev) => ({
                        ...prev,
                        [list.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddItem(list.id);
                    }}
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!newItemInputs[list.id]?.trim() || isPending}
                    onClick={() => handleAddItem(list.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
