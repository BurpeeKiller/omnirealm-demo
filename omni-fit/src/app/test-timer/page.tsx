"use client";

import { ReminderTimer } from "@/components/ReminderTimer";

export const dynamic = "force-dynamic";

export default function TestTimerPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Test ReminderTimer Component
        </h1>
        <ReminderTimer />
      </div>
    </div>
  );
}
