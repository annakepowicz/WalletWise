"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type Subscription = {
  id: string;
  providerName: string;
  amount: number;
  billingDay: number;
  startDate: string;
};

type CalendarGridProps = {
  subscriptions: Subscription[];
  onSubscriptionClick: (subscription: Subscription) => void;
};

const MONTH_NAMES = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

export function CalendarGrid({
  subscriptions,
  onSubscriptionClick,
}: CalendarGridProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startOffset }, () => null);

  // Filtrowanie subskrypcji
  const activeSubscriptions = subscriptions.filter((sub) => {
    const startDate = new Date(sub.startDate);
    if (currentYear > startDate.getFullYear()) return true;
    if (
      currentYear === startDate.getFullYear() &&
      currentMonth >= startDate.getMonth()
    )
      return true;
    return false;
  });

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const isCurrentMonth =
    currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <Card className="h-full border-none shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-500 font-medium">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              disabled={isCurrentMonth}
            >
              Dziś
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 border rounded-lg overflow-hidden shadow-sm">
          {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"].map((day) => (
            <div
              key={day}
              className="bg-gray-50 text-center py-3 text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}

          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="min-h-[100px] bg-gray-50" />
          ))}

          {daysArray.map((day) => {
            const subsToday = activeSubscriptions.filter(
              (s) => s.billingDay === day
            );
            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (
              <div
                key={day}
                className={`min-h-[100px] p-2 flex flex-col justify-between transition-all duration-200 ${
                  isToday
                    ? "bg-blue-50 ring-2 ring-inset ring-blue-400 z-10"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div
                  className={`text-right text-sm font-bold mb-1 ${
                    isToday ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {day}
                </div>

                <div className="space-y-1">
                  {subsToday.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => onSubscriptionClick(sub)}
                      className="w-full text-left text-[10px] bg-red-50 text-red-700 border border-red-100 px-1.5 py-1 rounded font-medium truncate shadow-sm hover:bg-red-100 cursor-pointer transition-colors"
                      title={`${sub.providerName}: ${sub.amount} zł`}
                    >
                      {sub.providerName}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
