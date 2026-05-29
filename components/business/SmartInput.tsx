"use client";

import { addSmartTransaction } from "@/app/actions/transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { useRef } from "react";

export function SmartInput() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-600" />
        Inteligentne dodawanie
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        <span className="text-red-600 font-medium">Wydatek:</span>{" "}
        <span className="font-mono bg-gray-100 px-1 rounded">
          Biedronka 150
        </span>{" "}
        lub <span className="font-mono bg-gray-100 px-1 rounded">Kino 45</span>
        <span className="mx-2">|</span>
        <span className="text-green-600 font-medium">Przychód:</span>{" "}
        <span className="font-mono bg-gray-100 px-1 rounded">Wypłata 5000</span>{" "}
        lub{" "}
        <span className="font-mono bg-gray-100 px-1 rounded">Premia 500</span>
      </p>

      <form
        ref={formRef}
        action={async (formData) => {
          await addSmartTransaction(formData);
          formRef.current?.reset();
        }}
        className="flex gap-2"
      >
        <Input
          name="smartInput"
          placeholder="Opisz transakcję (wydatek lub przychód)..."
          className="flex-1 text-lg"
          autoComplete="off"
        />
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Dodaj
        </Button>
      </form>
    </div>
  );
}
