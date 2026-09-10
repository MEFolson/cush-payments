import type { Platform } from "@/lib/platform";
import { PLATFORM_LABEL } from "@/lib/platform";
import { cn } from "@/lib/utils";

export function PlatformSwitch({
  value,
  onChange,
  inverted,
}: {
  value: Platform;
  onChange: (p: Platform) => void;
  inverted?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full p-1",
        inverted ? "bg-ink-2" : "bg-bone-2",
      )}
      role="tablist"
      aria-label="Device"
    >
      {(["ios", "android"] as const).map((p) => (
        <button
          key={p}
          type="button"
          role="tab"
          aria-selected={value === p}
          onClick={() => onChange(p)}
          className={cn(
            "h-9 min-w-20 rounded-full px-4 text-sm font-semibold tap-press",
            value === p
              ? inverted
                ? "bg-champagne text-bone"
                : "bg-ink text-bone"
              : inverted
                ? "text-bone/60"
                : "text-stone",
          )}
        >
          {PLATFORM_LABEL[p]}
        </button>
      ))}
    </div>
  );
}
