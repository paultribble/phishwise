import { cn } from "@/lib/utils";

export function PhishWiseLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* Shield */}
      <path
        d="M12 2L3 6.3V12c0 5.55 3.84 10.74 9 12.35C17.16 22.74 21 17.55 21 12V6.3L12 2z"
        fill="currentColor"
      />

      {/* Hook eye (ring at top) */}
      <circle
        cx="12"
        cy="7.6"
        r="1.3"
        stroke="white"
        strokeOpacity="0.9"
        strokeWidth="1.2"
        fill="none"
      />

      {/* Hook shank (straight section) */}
      <line
        x1="12"
        y1="8.9"
        x2="12"
        y2="14.2"
        stroke="white"
        strokeOpacity="0.9"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* Hook bend (J-curve) */}
      <path
        d="M12 14.2 Q12 18.8 8.6 18.8 Q6.4 18.8 6.4 16.7"
        stroke="white"
        strokeOpacity="0.9"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Barb */}
      <path
        d="M6.4 16.7 L8.1 15.1"
        stroke="white"
        strokeOpacity="0.9"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
