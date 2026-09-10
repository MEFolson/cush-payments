import { useState } from "react";
import { flagUrl } from "@/lib/countries";
import { cn } from "@/lib/utils";

export function Flag({
  iso2,
  className,
  size = 28,
}: {
  iso2: string;
  className?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const code = iso2.toUpperCase();
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-bone-2 text-ink",
        className,
      )}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      aria-hidden
    >
      {failed ? (
        <span className="font-mono text-[10px] font-medium tracking-wide">{code}</span>
      ) : (
        <img
          src={flagUrl(iso2, size >= 40 ? 80 : 40)}
          alt=""
          width={size}
          height={size}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
