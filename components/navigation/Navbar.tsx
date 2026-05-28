"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Target, CalendarDays,
  Wallet, BarChart3, ShoppingCart, Receipt,
  ChevronDown, LogOut, User,
} from "lucide-react";

async function handleSignOut() {
  const { signOut } = await import("next-auth/react");
  await signOut({ redirect: false });
  window.location.href = "/api/auth/logout";
}

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userEmail = session?.user?.email;
  const userName = session?.user?.name ?? userEmail;

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/goals", label: "Cele", icon: Target },
    { href: "/calendar", label: "Kalendarz", icon: CalendarDays },
    { href: "/charts", label: "Wykresy", icon: BarChart3 },
    { href: "/shopping-list", label: "Zakupy", icon: ShoppingCart },
    { href: "/receipts", label: "Paragony", icon: Receipt },
  ];

  return (
    <nav className="bg-white border-b px-4 py-3 mb-6 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Wallet className="h-6 w-6" />
          <span>WalletWise</span>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-1 overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="hidden sm:inline max-w-[150px] truncate">{userName}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-100 bg-white shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{userEmail}</p>
                  </div>

                  <div className="py-1">
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                      <User className="h-4 w-4" />
                      Twoje konto
                      <span className="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded"></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setOpen(false); handleSignOut(); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Wyloguj się
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => signIn("keycloak", { callbackUrl: "/" }, { prompt: "login" })}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Zaloguj się
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}