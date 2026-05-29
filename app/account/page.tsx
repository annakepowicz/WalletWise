import { getCurrentAuthSession } from "@/lib/auth";
import { SignOutButton } from "@/components/account/SignOutButton";

export default async function AccountPage() {
  const session = await getCurrentAuthSession();
  const user = session?.user;

  if (!user?.email) {
    return (
      <div className="flex h-screen items-center justify-center text-center px-4">
        <div>
          <h1 className="text-xl font-bold text-red-600">Brak aktywnej sesji</h1>
          <p className="mt-2 text-gray-500">Zaloguj się ponownie, aby zobaczyć ustawienia konta.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Twoje konto</h1>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Email</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Nazwa</p>
            <p>{user.name ?? "Brak nazwy"}</p>
          </div>
        </div>
        <div className="mt-8">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
