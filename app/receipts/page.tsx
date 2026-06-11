import { db } from "@/lib/db";
import { Receipt } from "lucide-react";
import { ReceiptScanPanel } from "@/components/business/ReceiptScanPanel";
import { getCurrentAppUser } from "@/lib/auth";

export default async function ReceiptsPage() {
  const user = await getCurrentAppUser();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <div>
          <h1 className="text-xl font-bold text-red-600">Brak danych</h1>
          <p>
            Uruchom w terminalu:{" "}
            <code className="bg-gray-100 p-1">npx prisma db seed</code>
          </p>
        </div>
      </div>
    );
  }

  const categories = await db.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <main className="max-w-6xl mx-auto px-4 pb-12">
      <header className="mb-8 mt-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
          <Receipt className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Paragony i faktury
          </h1>
          <p className="text-gray-500">
            Zrób zdjęcie paragonu — twój wydatek zostanie wczytany automatycznie.
          </p>
        </div>
      </header>

      <ReceiptScanPanel categories={categories} />
    </main>
  );
}
