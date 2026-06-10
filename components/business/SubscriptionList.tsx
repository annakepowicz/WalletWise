import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

type Sub = {
  id: string;
  providerName: string;
  amount: number;
  billingDay: number;
};

export function SubscriptionList({ subs }: { subs: Sub[] }) {
  const today = new Date().getDate();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />
          Kalendarz Subskrypcji
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subs.map((sub) => {
            const daysLeft = sub.billingDay - today;
            let statusText = "";
            let statusColor = "text-gray-500";

            if (daysLeft === 0) {
              statusText = "Dzisiaj!";
              statusColor = "text-red-600 font-bold";
            } else if (daysLeft > 0) {
              statusText = `za ${daysLeft} dni`;
              statusColor = "text-orange-600";
            } else {
              statusText = "Opłacono";
              statusColor = "text-green-600";
            }

            return (
              <div
                key={sub.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 w-8 h-8 rounded flex items-center justify-center font-bold text-xs text-gray-600">
                    {sub.billingDay}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{sub.providerName}</p>
                    <p className={`text-xs ${statusColor}`}>{statusText}</p>
                  </div>
                </div>
                <div className="font-medium text-sm">
                  -{sub.amount.toFixed(2)} PLN
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
