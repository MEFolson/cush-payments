import { useState } from "react";
import { Delete, Fingerprint, ScanFace } from "lucide-react";
import { DEMO_PASSCODE } from "@/lib/compliance";
import type { Platform } from "@/lib/platform";
import { useCush } from "@/lib/store";
import { cn } from "@/lib/utils";

const PIN_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"] as const;

export function LockScreen({ platform }: { platform: Platform }) {
  const profile = useCush((s) => s.profile);
  const unlock = useCush((s) => s.unlock);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [scanning, setScanning] = useState(false);

  function apply(key: string) {
    if (!key) return;
    setError(false);
    if (key === "del") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    const next = (pin + key).slice(0, 4);
    setPin(next);
    if (next.length === 4) {
      if (next === profile.passcode) unlock();
      else {
        setError(true);
        window.setTimeout(() => setPin(""), 280);
      }
    }
  }

  function biometrics() {
    if (!profile.biometrics) {
      setError(true);
      return;
    }
    setScanning(true);
    window.setTimeout(() => {
      setScanning(false);
      unlock();
    }, 420);
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-ink px-6 pt-20 pb-8 text-bone">
      <p className="label-kicker text-champagne">Cush Payments</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-bone/65">
        {profile.biometrics
          ? platform === "ios"
            ? "Face ID or your passcode."
            : "Fingerprint or your passcode."
          : "Enter your 4-digit passcode."}
      </p>

      <div className="mt-10 flex justify-center gap-3" aria-label="Passcode">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "size-3.5 rounded-full border border-bone/40",
              pin.length > i && "bg-champagne border-champagne",
              error && "border-destructive bg-destructive",
            )}
          />
        ))}
      </div>
      {error && (
        <p className="mt-3 text-center text-xs text-destructive">That passcode does not match.</p>
      )}

      {profile.biometrics && (
        <button
          type="button"
          onClick={biometrics}
          className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-ink-2 text-bone tap-press"
          aria-label={platform === "ios" ? "Unlock with Face ID" : "Unlock with fingerprint"}
        >
          {platform === "ios" ? (
            <ScanFace className={cn("size-8", scanning && "opacity-50")} />
          ) : (
            <Fingerprint className={cn("size-8", scanning && "opacity-50")} />
          )}
        </button>
      )}
      <p className="mt-3 text-center text-xs text-bone/45">
        {scanning ? "Recognising…" : `Demo passcode ${DEMO_PASSCODE}`}
      </p>

      <div className="mt-auto grid grid-cols-3 gap-2 pb-6">
        {PIN_KEYS.map((key, i) =>
          key === "" ? (
            <span key={i} />
          ) : (
            <button
              key={key}
              type="button"
              onClick={() => apply(key)}
              className="flex h-14 items-center justify-center rounded-full bg-ink-2 font-display text-2xl font-semibold tap-press"
              aria-label={key === "del" ? "Delete" : key}
            >
              {key === "del" ? <Delete className="size-6" /> : key}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
