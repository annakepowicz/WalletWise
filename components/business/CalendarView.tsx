"use client";

import { useState } from "react";
import { CalendarGrid } from "./CalendarGrid";
import { SubscriptionModal } from "./SubscriptionModal";

type Subscription = {
  id: string;
  providerName: string;
  amount: number;
  billingDay: number;
  startDate: string;
};

type CalendarViewProps = {
  subscriptions: Subscription[];
};

export function CalendarView({ subscriptions }: CalendarViewProps) {
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  return (
    <>
      <CalendarGrid
        subscriptions={subscriptions}
        onSubscriptionClick={setSelectedSubscription}
      />
      {selectedSubscription && (
        <SubscriptionModal
          subscription={selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
        />
      )}
    </>
  );
}
