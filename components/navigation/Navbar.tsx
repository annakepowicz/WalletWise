"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  CalendarDays,
  Wallet,
  BarChart3,
  ShoppingCart,
  Receipt,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

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
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Wallet className="h-6 w-6" />
          <span>WalletWise</span>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
