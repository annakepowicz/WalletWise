"use client";

import { useState, useRef, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Receipt, Upload, Loader2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { processReceiptImage, ReceiptData } from "@/app/actions/ocr";
import { saveReceiptTransaction } from "@/app/actions/receipt";

type Category = { id: string; name: string };
type PanelState = "idle" | "loading" | "review" | "saving" | "success";

export function ReceiptScanPanel({ categories }: { categories: Category[] }) {
  const [state, setState] = useState<PanelState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    categoryId: categories[0]?.id ?? "",
  });

  async function handleFileChange(file: File) {
    setState("loading");
    setError(null);

    const formData = new FormData();
    formData.append("image", file);
    const result: ReceiptData = await processReceiptImage(formData);

    if (result.error) {
      setError(result.error);
      setState("idle");
      return;
    }

    setForm({
      description: result.storeName ?? "",
      amount: result.total?.toString() ?? "",
      date: result.date ?? new Date().toISOString().slice(0, 10),
      categoryId: categories[0]?.id ?? "",
    });
    setState("review");
  }

  function handleReset() {
    setState("idle");
    setError(null);
    setForm({
      description: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      categoryId: categories[0]?.id ?? "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSave() {
    const amount = parseFloat(form.amount.replace(",", "."));
    if (!form.description.trim() || isNaN(amount) || amount <= 0) {
      setError("Podaj opis i poprawną kwotę.");
      return;
    }

    setState("saving");
    startTransition(async () => {
      const result = await saveReceiptTransaction({
        description: form.description.trim(),
        amount,
        date: form.date,
        categoryId: form.categoryId || undefined,
      });

      if (result.error) {
        setError(result.error);
        setState("review");
      } else {
        setState("success");
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Lewa kolumna: instrukcja */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Skanuj paragon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <p>Zrób zdjęcie paragonu lub faktury - twój wydatek zostanie wczytany automatycznie:</p>
            <ul className="space-y-2">
              {[
                "Nazwę sklepu / sprzedawcy",
                "Datę zakupu",
                "Łączną kwotę do zapłaty",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 leading-relaxed pt-2 border-t">
              Przed zapisem możesz edytować odczytane dane i przypisać kategorię.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prawa kolumna: panel główny */}
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-gray-50/50 py-3 px-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                <Receipt className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Nowy paragon</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="px-5 pt-5 pb-6">
            {/* IDLE */}
            {state === "idle" && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(file);
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-orange-200 rounded-xl bg-orange-50/40 hover:bg-orange-50 transition-colors p-10 flex flex-col items-center gap-3 text-orange-600 cursor-pointer"
                >
                  <Upload className="h-8 w-8" />
                  <span className="font-semibold">Kliknij, aby wybrać zdjęcie</span>
                  <span className="text-xs text-gray-400">JPG, PNG, WEBP</span>
                </button>
                {error && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </p>
                )}
              </div>
            )}

            {/* LOADING */}
            {state === "loading" && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-orange-600">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="font-medium">Analizuję paragon...</p>
                <p className="text-xs text-gray-400">To może potrwać kilka sekund</p>
              </div>
            )}

            {/* REVIEW */}
            {(state === "review" || state === "saving") && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700">
                  Sprawdź i edytuj odczytane dane:
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Opis / Nazwa sklepu
                  </label>
                  <Input
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="np. Biedronka"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-500">
                      Kwota (PLN)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-500">
                      Data
                    </label>
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    />
                  </div>
                </div>

                {categories.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-500">
                      Kategoria
                    </label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {error && (
                  <p className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    onClick={handleSave}
                    disabled={state === "saving"}
                  >
                    {state === "saving" ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Zapisuję...</>
                    ) : (
                      "Zapisz transakcję"
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleReset} disabled={state === "saving"}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* SUCCESS */}
            {state === "success" && (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <div className="p-4 rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <p className="font-semibold text-gray-800 text-lg">Transakcja zapisana!</p>
                <p className="text-sm text-gray-400">Paragon został dodany do historii wydatków.</p>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="mt-2"
                >
                  Skanuj kolejny paragon
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}