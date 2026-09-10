import { useEffect, useState } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";
import type { Platform } from "@/lib/platform";

function clockLabel(now: Date) {
  return now.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" });
}

export function StatusBar({
  platform,
  inverted,
}: {
  platform: Platform;
  inverted?: boolean;
}) {
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    const tick = () => setTime(clockLabel(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const ink = inverted ? "text-bone" : "text-ink";

  if (platform === "ios") {
    return (
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex h-14 items-start justify-between px-8 pt-3.5 ${ink}`}
        aria-hidden
      >
        <span className="min-w-10 text-center text-[15px] font-semibold tabular">{time}</span>
        <span className="absolute top-2.5 left-1/2 h-7 w-28 -translate-x-1/2 rounded-full bg-ink" />
        <span className="flex items-center gap-1 pt-0.5">
          <Signal className="size-3.5" strokeWidth={2.4} />
          <Wifi className="size-3.5" strokeWidth={2.4} />
          <BatteryFull className="size-4" strokeWidth={2} />
        </span>
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex h-9 items-center justify-between px-4 ${ink}`}
      aria-hidden
    >
      <span className="text-[13px] font-medium tabular">{time}</span>
      <span className="absolute top-2 left-1/2 size-3 -translate-x-1/2 rounded-full bg-ink" />
      <span className="flex items-center gap-1.5">
        <Wifi className="size-3.5" strokeWidth={2.2} />
        <Signal className="size-3.5" strokeWidth={2.2} />
        <BatteryFull className="size-4" strokeWidth={2} />
      </span>
    </div>
  );
}

export function HomeIndicator({ platform }: { platform: Platform }) {
  if (platform === "ios") {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-1 z-30 flex justify-center" aria-hidden>
        <span className="h-1.5 w-32 rounded-full bg-ink/80" />
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-30 flex justify-center" aria-hidden>
      <span className="h-1 w-24 rounded-full bg-ink/50" />
    </div>
  );
}
