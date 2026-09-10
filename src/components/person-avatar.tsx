import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const TONES = ["bg-ink text-bone", "bg-champagne text-bone", "bg-ink-2 text-bone-2", "bg-stone text-bone"];

export function PersonAvatar({
  name,
  size = 44,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const tone = TONES[name.length % TONES.length]!;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-semibold tracking-tight",
        tone,
        className,
      )}
      style={{ width: size, height: size, borderRadius: size / 2, fontSize: size * 0.34 }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
