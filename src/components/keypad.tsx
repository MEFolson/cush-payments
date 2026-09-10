import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"] as const;

export function applyKey(value: string, key: string) {
  if (key === "del") {
    return value.length <= 1 ? "" : value.slice(0, -1);
  }
  if (key === ".") {
    if (value.includes(".")) return value;
    return value === "" ? "0." : value + ".";
  }
  if (value === "0" && key !== ".") return key;
  if (value.includes(".")) {
    const dec = value.split(".")[1] ?? "";
    if (dec.length >= 2) return value;
  }
  if (value.replace(".", "").length >= 9) return value;
  return value + key;
}

export function Keypad({
  onKey,
  className,
}: {
  onKey: (key: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-3 gap-1.5", className)}>
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onKey(key)}
          className={cn(
            "flex h-14 items-center justify-center rounded-lg font-display text-2xl font-semibold text-ink",
            "transition-colors duration-150 hover:bg-bone-2 tap-press",
          )}
          aria-label={key === "del" ? "Delete" : key}
        >
          {key === "del" ? <Delete className="size-6" /> : key}
        </button>
      ))}
    </div>
  );
}
