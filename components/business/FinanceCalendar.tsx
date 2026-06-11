"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  PiggyBank,
  Receipt,
} from "lucide-react";

export type CalendarEvent = {
  id: string;
  date: string;
  label: string;
  amount?: number;
  kind: "transaction" | "subscription" | "goal";
  transactionType?: "INCOME" | "EXPENSE";
};

type SubscriptionInput = {
  id: string;
  providerName: string;
  amount: number;
  billingDay: number;
};

type FinanceCalendarProps = {
  transactions: CalendarEvent[];
  subscriptions: SubscriptionInput[];
  goals: CalendarEvent[];
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

const WEEKDAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function eventIcon(event: CalendarEvent) {
  if (event.kind === "subscription") return CreditCard;
  if (event.kind === "goal") return PiggyBank;
  return Receipt;
}

export function FinanceCalendar({
  transactions,
  subscriptions,
  goals,
}: FinanceCalendarProps) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;

  const monthEvents = useMemo(() => {
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const subscriptionEvents: CalendarEvent[] = subscriptions.map((sub) => {
      const billingDay = Math.min(sub.billingDay, lastDayOfMonth);
      return {
        id: `sub-${sub.id}-${year}-${month}`,
        date: new Date(year, month, billingDay).toISOString(),
        label: `${sub.providerName} (subskrypcja)`,
        amount: sub.amount,
        kind: "subscription",
        transactionType: "EXPENSE",
      };
    });

    const inMonth = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.getMonth() === month && date.getFullYear() === year;
    };

    return [
      ...transactions.filter((e) => inMonth(e.date)),
      ...subscriptionEvents,
      ...goals.filter((e) => inMonth(e.date)),
    ];
  }, [transactions, subscriptions, goals, month, year]);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    for (const event of monthEvents) {
      const day = new Date(event.date).getDate();
      const list = map.get(day) ?? [];
      list.push(event);
      map.set(day, list);
    }
    return map;
  }, [monthEvents]);

  const [activeDay, setActiveDay] = useState<number | null>(
    today.getMonth() === month && today.getFullYear() === year
      ? today.getDate()
      : null
  );

  const activeEvents =
    activeDay !== null ? (eventsByDay.get(activeDay) ?? []) : [];

  const goPrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setActiveDay(null);
  };

  const goNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setActiveDay(null);
  };

  const goToday = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    setActiveDay(today.getDate());
  };

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2 border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              {MONTH_NAMES[month]} {year}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goPrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToday}>
                Dziś
              </Button>
              <Button variant="outline" size="sm" onClick={goNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-500 py-1"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="min-h-[72px]" />;
              }

              const dayEvents = eventsByDay.get(day) ?? [];
              const cellDate = new Date(year, month, day);
              const isToday = sameDay(cellDate, today);
              const isActive = activeDay === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setActiveDay(day)}
                  className={`min-h-[72px] rounded-lg border p-1 text-left transition-colors ${
                    isActive
                      ? "border-blue-500 bg-blue-50"
                      : isToday
                        ? "border-blue-200 bg-blue-50/40"
                        : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold ${
                      isToday ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="truncate rounded px-1 text-[10px] bg-gray-100 text-gray-700"
                      >
                        {event.label}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-gray-400 px-1">
                        +{dayEvents.length - 2}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">
            {activeDay !== null
              ? `${activeDay} ${MONTH_NAMES[month]} ${year}`
              : "Wybierz dzień"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeEvents.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              Brak wydarzeń w tym dniu.
            </p>
          ) : (
            <ul className="space-y-3">
              {activeEvents.map((event) => {
                const Icon = eventIcon(event);
                const isIncome = event.transactionType === "INCOME";
                return (
                  <li
                    key={event.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="rounded-md bg-gray-100 p-2">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {event.label}
                      </p>
                      {event.amount !== undefined && (
                        <p
                          className={`text-sm font-mono ${
                            isIncome ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {event.amount.toFixed(2)} zł
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
