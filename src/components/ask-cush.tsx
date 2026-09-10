import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { parseSendIntent } from "@/lib/ai";
import { RATE_LOCK_MS } from "@/lib/compliance";
import { COUNTRY_BY_ISO } from "@/lib/countries";
import { useCush } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AskCush({ compact }: { compact?: boolean }) {
  const navigate = useNavigate();
  const people = useCush((s) => s.people);
  const sendCurrency = useCush((s) => s.profile.sendCurrency);
  const setDraft = useCush((s) => s.setDraft);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  async function run(e: FormEvent) {
    e.preventDefault();
    const utterance = text.trim();
    if (!utterance || busy) return;
    setBusy(true);
    setError(null);
    setHint(null);
    try {
      const result = await parseSendIntent({
        data: {
          text: utterance,
          sendCurrency,
          people: people.map((p) => ({
            id: p.id,
            name: p.name,
            relation: p.relation,
            iso2: p.iso2,
          })),
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const intent = result.intent;
      const person =
        people.find((p) => p.id === intent.personId) ??
        people.find(
          (p) =>
            intent.personHint &&
            p.name.toLowerCase().includes(intent.personHint.toLowerCase()),
        );
      const iso2 = (person?.iso2 ?? intent.iso2 ?? "gh").toLowerCase();
      const country = COUNTRY_BY_ISO[iso2];
      let amount = intent.amount != null ? String(intent.amount) : "";
      let mode = intent.mode;
      if (intent.amount != null && intent.amountCurrency) {
        const local = country?.currency;
        if (intent.amountCurrency === sendCurrency) mode = "you_send";
        else if (local && intent.amountCurrency === local) mode = "they_receive";
      }
      if (!amount && person) amount = String(person.usualReceive);
      setDraft({
        personId: person?.id ?? null,
        iso2,
        railId: person?.railId ?? country?.rails[0]?.id ?? "bank",
        mode,
        amount,
        purpose: intent.purpose ?? person?.usualPurpose ?? "Family",
        step: person && amount ? "review" : "compose",
        receiptId: null,
        rateLockUntil: person && amount ? Date.now() + RATE_LOCK_MS : null,
      });
      setHint(intent.summary);
      setText("");
      void navigate({ to: "/send" });
    } catch {
      setError("Could not reach Cush just now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={run} className={cn("w-full", compact && "")}>
      <div className="flex items-center gap-2 rounded-full bg-surface py-1.5 pr-1.5 pl-4 shadow-border">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Try “send 2,000 cedis to Ama for rent”'
          className="h-10 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ash"
          suppressHydrationWarning
        />
        <button
          type="submit"
          disabled={busy || !text.trim()}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-champagne text-bone disabled:opacity-40 tap-press"
          aria-label="Ask Cush"
        >
          <ArrowUp className="size-5" />
        </button>
      </div>
      {busy && <p className="mt-2 px-1 text-xs text-ash">Reading that…</p>}
      {error && <p className="mt-2 px-1 text-xs text-destructive">{error}</p>}
      {hint && <p className="mt-2 px-1 text-xs text-stone">{hint}</p>}
    </form>
  );
}
