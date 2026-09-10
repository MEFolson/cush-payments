import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onClose,
  title,
  children,
  tall,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  tall?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-ink/45"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 flex flex-col rounded-t-xl bg-surface shadow-lift",
          tall ? "max-h-[88%]" : "max-h-[76%]",
        )}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <p className="font-display text-lg font-semibold tracking-tight text-ink">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-full bg-bone-2 text-ink tap-press"
            aria-label="Close sheet"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">{children}</div>
      </div>
    </div>
  );
}
