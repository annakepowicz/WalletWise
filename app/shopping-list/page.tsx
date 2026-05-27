import { db } from "@/lib/db";
import { ShoppingCart } from "lucide-react";
import { ShoppingListPanel } from "@/components/business/ShoppingListPanel";

export default async function ShoppingListPage() {
  const user = await db.user.findFirst({
    include: {
      shoppingLists: {
        orderBy: { createdAt: "desc" },
        include: {
          items: { orderBy: { id: "asc" } },
        },
      },
    },
  });

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

  const lists = user.shoppingLists.map((list) => ({
    id: list.id,
    name: list.name,
    items: list.items.map((item) => ({
      id: item.id,
      name: item.name,
      isChecked: item.isChecked,
    })),
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 pb-12">
      <header className="mb-8 mt-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
          <ShoppingCart className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Lista zakupów
          </h1>
          <p className="text-gray-500">
            Twórz listy ręcznie lub załaduj zdjęcie wydrukowanej/odręcznie napisanej listy lub paragaonu.
          </p>
        </div>
      </header>

      <ShoppingListPanel lists={lists} />
    </main>
  );
}
