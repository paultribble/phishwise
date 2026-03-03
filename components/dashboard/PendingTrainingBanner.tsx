"use client";

import { useState } from "react";
import Link from "next/link";
import { X, BookOpen } from "lucide-react";

interface PendingTrainingBannerProps {
  pendingCount: number;
}

export function PendingTrainingBanner({ pendingCount }: PendingTrainingBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (pendingCount === 0 || dismissed) {
    return null;
  }

  return (
    <div className="rounded-lg border border-warning-500/50 bg-warning-500/10 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-warning-400 shrink-0" />
          <p className="text-sm text-warning-200">
            You have{" "}
            <span className="font-semibold text-warning-300">
              {pendingCount} pending training {pendingCount === 1 ? "module" : "modules"}
            </span>{" "}
            to complete.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/training"
            className="rounded-md bg-warning-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-warning-700"
          >
            View Training
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
