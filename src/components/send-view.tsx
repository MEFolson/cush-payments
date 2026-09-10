import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronDown, ChevronLeft, Delete, Fingerprint, ScanFace, ShieldCheck } from "lucide-react";
import { Flag } from "@/components/flag";
import { Keypad, applyKey } from "@/components/keypad";
import { PersonAvatar } from "@/components/person-avatar";
import { Sheet } from "@/components/sheet";
import { Button } from "@/components/ui/button";
import {
  limitCheck,
  nameEnquiry,
  receiptRef,
} from "@/lib/compliance";
import { COUNTRIES, countryByIso } from "@/lib/countries";
import { formatMoney, formatRate } from "@/lib/format";
import { FEE_RATE, quoteAmount } from "@/lib/quote";
import { personById, useCush, type Person } from "@/lib/store";
import { cn } from "@/lib/utils";

const PURPOSES = ["Rent", "School", "Family", "Medical", "Business"];

export function SendView() {
  const draft = useCush((s) => s.draft);
  if (draft.step === "review") return <ReviewStep />;
  if (draft.step === "sca") return <ScaStep />;
  if (draft.step === "receipt") return <ReceiptStep />;
  return <ComposeStep />;
}

function ComposeStep() {
  const navigate = useNavigate();
  const profile = useCush((s) => s.profile);
  const people = useCush((s) => s.people);
  const draft = useCush((s) => s.draft);
  const setDraft = useCush((s) => s.setDraft);
  const beginReview = useCush((s) => s.beginReview);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [railOpen, setRailOpen] = useState(false);
  const [query, setQuery] = useState("");

  const person = personById(people, draft.personId);
  const country = countryByIso(draft.iso2);
  const rail = country?.rails.find((r) => r.id === draft.railId) ?? country?.rails[0];
  const amountNum = Number(draft.amount) || 0;
  const quote = quoteAmount({
    iso2: draft.iso2,
    sendCurrency: profile.sendCurrency,
    mode: draft.mode,
    amount: amountNum,
  });

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.currency.toLowerCase().includes(query.toLowerCase()) ||
      c.iso2.includes(query.toLowerCase()),
  );

  function pickPerson(p: Person) {
    setDraft({
      personId: p.id,
      iso2: p.iso2,
      railId: p.railId,
      amount: String(p.usualReceive),
      purpose: p.usualPurpose,
      mode: "they_receive",
    });
    setPeopleOpen(false);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between px-4 pt-2 pb-2">
        <button
          type="button"
          onClick={() => void navigate({ to: "/" })}
          className="flex size-11 items-center justify-center rounded-full tap-press"
          aria-label="Back"
        >
          <ChevronLeft className="size-6" />
        </button>
        <p className="font-display text-base font-semibold">Send</p>
        <span className="w-11" />
      </header>

      <div className="px-5">
        <button
          type="button"
          onClick={() => setPeopleOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl bg-surface px-3 py-3 text-left shadow-border tap-press"
        >
          {person ? (
            <PersonAvatar name={person.name} size={44} />
          ) : (
            <span className="flex size-11 items-center justify-center rounded-full bg-bone-2 text-sm font-semibold">
              ?
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="label-kicker text-ash">To</p>
            <p className="truncate font-semibold">{person ? person.name : "Choose someone"}</p>
            <p className="truncate text-xs text-stone">
              {person?.relation}
              {rail ? ` · ${rail.name}` : ""}
            </p>
          </div>
          <ChevronDown className="size-5 text-ash" />
        </button>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setCountryOpen(true)}
            className="flex min-h-11 flex-1 items-center gap-2 rounded-full bg-surface px-3 text-sm font-semibold shadow-border"
          >
            <Flag iso2={draft.iso2} size={18} />
            {country?.name ?? "Country"}
            <ChevronDown className="ml-auto size-4 text-ash" />
          </button>
          <button
            type="button"
            onClick={() => setRailOpen(true)}
            className="flex min-h-11 flex-1 items-center gap-2 rounded-full bg-surface px-3 text-sm font-semibold shadow-border"
          >
            <span className="truncate">{rail?.name ?? "Rail"}</span>
            <ChevronDown className="ml-auto size-4 shrink-0 text-ash" />
          </button>
        </div>

        <div className="mt-4 flex rounded-full bg-bone-2 p-1">
          {(
            [
              ["they_receive", "They receive"],
              ["you_send", "You send"],
            ] as const
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setDraft({ mode })}
              className={cn(
                "h-10 flex-1 rounded-full text-sm font-semibold tap-press",
                draft.mode === mode ? "bg-surface text-ink shadow-border" : "text-stone",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 text-center">
          <p className="label-kicker text-ash">
            {draft.mode === "they_receive"
              ? `They get · ${country?.currency}`
              : `You send · ${profile.sendCurrency}`}
          </p>
          <p className="mt-1 font-display text-5xl leading-none font-bold tracking-tight tabular">
            {draft.amount || "0"}
          </p>
          {quote && (
            <p className="mt-2 text-sm text-stone">
              {draft.mode === "they_receive"
                ? `You pay ${formatMoney(quote.youPay, profile.sendCurrency)}`
                : `They get ${formatMoney(quote.receiveAmount, quote.receiveCurrency)}`}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {PURPOSES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setDraft({ purpose: p })}
              className={cn(
                "h-9 rounded-full px-3 text-sm font-medium tap-press",
                draft.purpose === p ? "bg-ink text-bone" : "bg-surface text-stone shadow-border",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto px-3 pt-3">
        <Keypad onKey={(k) => setDraft({ amount: applyKey(draft.amount, k) })} />
        <div className="px-2 pt-2 pb-16">
          <Button size="lg" block disabled={!quote || !person} onClick={() => beginReview()}>
            {quote
              ? `Review ${formatMoney(quote.receiveAmount, quote.receiveCurrency)}`
              : "Enter an amount"}
          </Button>
          <p className="mt-2 text-center text-[11px] text-ash">
            1.8% fee. Mid-market rate. Rate locks for 30 seconds on review.
          </p>
        </div>
      </div>

      <Sheet open={peopleOpen} onClose={() => setPeopleOpen(false)} title="Who gets it">
        <div className="space-y-2 pb-4">
          {people.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => pickPerson(p)}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-bone-2"
            >
              <PersonAvatar name={p.name} size={44} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-stone">
                  {p.relation} · {countryByIso(p.iso2)?.name}
                </p>
              </div>
              {draft.personId === p.id && <Check className="size-4 text-champagne" />}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={countryOpen} onClose={() => setCountryOpen(false)} title="Where in Africa" tall>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search country or currency"
          className="mb-3 h-12 w-full rounded-full bg-bone-2 px-4 text-sm outline-none"
        />
        <div className="space-y-1 pb-6">
          {filtered.map((c) => (
            <button
              key={c.iso2}
              type="button"
              onClick={() => {
                setDraft({
                  iso2: c.iso2,
                  railId: c.rails[0]?.id ?? "bank",
                  personId: person && person.iso2 === c.iso2 ? person.id : null,
                });
                setCountryOpen(false);
                setQuery("");
              }}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-bone-2"
            >
              <Flag iso2={c.iso2} size={28} />
              <div className="flex-1 text-left">
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-stone">
                  {c.currency} · {c.rails[0]?.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={railOpen} onClose={() => setRailOpen(false)} title="How they get it">
        <div className="space-y-2 pb-4">
          {country?.rails.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setDraft({ railId: r.id });
                setRailOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg bg-paper px-4 py-3 text-left shadow-border"
            >
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-xs text-stone">
                  {r.kind === "wallet" ? "Mobile wallet" : "Bank"} · arrives in {r.eta}
                </p>
              </div>
              {draft.railId === r.id && <Check className="size-4 text-champagne" />}
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

function useLockLeft(until: number | null) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    function tick() {
      setLeft(until ? Math.max(0, until - Date.now()) : 0);
    }
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [until]);
  return left;
}

function ReviewStep() {
  const profile = useCush((s) => s.profile);
  const people = useCush((s) => s.people);
  const transfers = useCush((s) => s.transfers);
  const draft = useCush((s) => s.draft);
  const setDraft = useCush((s) => s.setDraft);
  const beginReview = useCush((s) => s.beginReview);
  const person = personById(people, draft.personId);
  const country = countryByIso(draft.iso2);
  const rail = country?.rails.find((r) => r.id === draft.railId);
  const quote = quoteAmount({
    iso2: draft.iso2,
    sendCurrency: profile.sendCurrency,
    mode: draft.mode,
    amount: Number(draft.amount) || 0,
  });
  const left = useLockLeft(draft.rateLockUntil);
  const expired = left <= 0;
  const secs = Math.ceil(left / 1000);

  if (!quote || !country || !person) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
        <p className="text-stone">Choose someone and an amount first.</p>
        <Button variant="outline" onClick={() => setDraft({ step: "compose" })}>
          Back to send
        </Button>
      </div>
    );
  }

  const enquiry = nameEnquiry(person);
  const limits = limitCheck({
    sendAmount: quote.sendAmount,
    sendCurrency: profile.sendCurrency,
    transfers,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center px-4 pt-2 pb-2">
        <button
          type="button"
          onClick={() => setDraft({ step: "compose", rateLockUntil: null })}
          className="flex size-11 items-center justify-center rounded-full tap-press"
          aria-label="Back"
        >
          <ChevronLeft className="size-6" />
        </button>
        <p className="flex-1 text-center font-display text-base font-semibold">Check this</p>
        <span className="w-11" />
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="rounded-[20px] bg-ink p-5 text-bone">
          <p className="label-kicker text-champagne">They receive</p>
          <p className="mt-2 font-display text-4xl font-bold tracking-tight tabular">
            {formatMoney(quote.receiveAmount, quote.receiveCurrency)}
          </p>
          <p className="mt-2 text-sm text-bone/65">
            {person.name} · {rail?.name} · {country.name}
          </p>
        </div>

        <div
          className={cn(
            "mt-3 flex items-center justify-between rounded-xl px-4 py-3 text-sm",
            expired ? "bg-destructive/10 text-destructive" : "bg-bone-2 text-stone",
          )}
        >
          <span className="font-semibold">{expired ? "Rate expired" : "Rate locked"}</span>
          {expired ? (
            <button type="button" onClick={() => beginReview()} className="font-semibold text-champagne">
              Refresh 30s
            </button>
          ) : (
            <span className="font-mono tabular">
              0:{String(secs).padStart(2, "0")} · mid-market
            </span>
          )}
        </div>

        <div className="mt-3 flex items-start gap-3 rounded-xl bg-surface px-4 py-3 shadow-border">
          <ShieldCheck className="mt-0.5 size-5 text-success" />
          <div>
            <p className="text-sm font-semibold">
              {enquiry.matched ? "Name matches" : "Name check pending"}
            </p>
            <p className="text-xs text-stone">
              {enquiry.method}: {enquiry.legalName}
            </p>
          </div>
        </div>

        <dl className="mt-4 divide-y divide-line overflow-hidden rounded-xl bg-surface shadow-border">
          <Row label="You send" value={formatMoney(quote.sendAmount, quote.sendCurrency)} />
          <Row label="Fee · 1.8%" value={formatMoney(quote.fee, quote.sendCurrency)} />
          <Row
            label="Rate"
            value={formatRate(quote.sendCurrency, quote.receiveCurrency, quote.rate)}
          />
          <Row label="Purpose" value={draft.purpose || "Family"} />
          <Row label="Payout" value={person.account} />
        </dl>

        <div className="mt-4 rounded-xl bg-bone-2 px-4 py-3 text-sm text-stone">
          Versus a typical 6.5% app, {person.name.split(" ")[0]} gets about{" "}
          <span className="font-semibold text-ink">
            {formatMoney(quote.extraForFamily, quote.receiveCurrency)}
          </span>{" "}
          more on this send.
        </div>

        {!limits.ok && (
          <p className="mt-3 text-sm text-destructive">{limits.reason}</p>
        )}
      </div>

      <div className="px-5 pb-16">
        <Button
          size="lg"
          block
          disabled={expired || !limits.ok}
          onClick={() => setDraft({ step: "sca" })}
        >
          Authenticate {formatMoney(quote.youPay, quote.sendCurrency)}
        </Button>
        <p className="mt-2 text-center text-[11px] text-ash">
          Strong customer authentication · PSD2-style step-up ·{" "}
          {((1 - FEE_RATE) * 100).toFixed(1)}% lands with them.
        </p>
      </div>
    </div>
  );
}

function ScaStep() {
  const platform = useCush((s) => s.platform);
  const profile = useCush((s) => s.profile);
  const people = useCush((s) => s.people);
  const draft = useCush((s) => s.draft);
  const setDraft = useCush((s) => s.setDraft);
  const addTransfer = useCush((s) => s.addTransfer);
  const person = personById(people, draft.personId);
  const quote = quoteAmount({
    iso2: draft.iso2,
    sendCurrency: profile.sendCurrency,
    mode: draft.mode,
    amount: Number(draft.amount) || 0,
  });
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  function confirm() {
    if (!quote || !person) return;
    addTransfer({
      personId: person.id,
      iso2: draft.iso2,
      railId: draft.railId,
      sendAmount: quote.sendAmount,
      sendCurrency: profile.sendCurrency,
      receiveAmount: quote.receiveAmount,
      receiveCurrency: quote.receiveCurrency,
      fee: quote.fee,
      rate: quote.rate,
      purpose: draft.purpose,
    });
  }

  function apply(key: string) {
    if (key === "del") {
      setPin((p) => p.slice(0, -1));
      setError(false);
      return;
    }
    if (!/^\d$/.test(key)) return;
    const next = (pin + key).slice(0, 4);
    setPin(next);
    if (next.length === 4) {
      if (next === profile.passcode) confirm();
      else {
        setError(true);
        window.setTimeout(() => setPin(""), 280);
      }
    }
  }

  function biometrics() {
    if (!profile.biometrics) return;
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      confirm();
    }, 380);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 pt-2">
      <header className="flex items-center">
        <button
          type="button"
          onClick={() => setDraft({ step: "review" })}
          className="flex size-11 items-center justify-center rounded-full tap-press"
          aria-label="Back"
        >
          <ChevronLeft className="size-6" />
        </button>
        <p className="flex-1 text-center font-display text-base font-semibold">Confirm send</p>
        <span className="w-11" />
      </header>
      <p className="mt-4 text-center text-sm text-stone">
        Strong customer authentication. Prove it is you before Cush leaves your
        bank.
      </p>
      {quote && (
        <p className="mt-2 text-center font-display text-2xl font-bold tabular">
          {formatMoney(quote.youPay, profile.sendCurrency)}
        </p>
      )}

      <div className="mt-8 flex justify-center gap-3">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "size-3.5 rounded-full border border-line",
              pin.length > i && "border-champagne bg-champagne",
              error && "border-destructive bg-destructive",
            )}
          />
        ))}
      </div>

      {profile.biometrics && (
        <button
          type="button"
          onClick={biometrics}
          className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-bone tap-press"
          aria-label="Confirm with biometrics"
        >
          {platform === "ios" ? (
            <ScanFace className="size-8" />
          ) : (
            <Fingerprint className="size-8" />
          )}
        </button>
      )}
      <p className="mt-2 text-center text-xs text-ash">
        {busy ? "Authorising…" : platform === "ios" ? "Face ID or passcode" : "Fingerprint or passcode"}
      </p>

      <div className="mt-auto grid grid-cols-3 gap-1.5 pb-16">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((key, i) =>
          key === "" ? (
            <span key={i} />
          ) : (
            <button
              key={key}
              type="button"
              onClick={() => apply(key)}
              className="flex h-14 items-center justify-center rounded-lg font-display text-2xl font-semibold tap-press hover:bg-bone-2"
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="text-sm text-stone">{label}</dt>
      <dd className="text-right text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}

function ReceiptStep() {
  const navigate = useNavigate();
  const people = useCush((s) => s.people);
  const transfers = useCush((s) => s.transfers);
  const draft = useCush((s) => s.draft);
  const setDraft = useCush((s) => s.setDraft);
  const markComplete = useCush((s) => s.markComplete);
  const transfer = transfers.find((t) => t.id === draft.receiptId) ?? transfers[0];
  const person = personById(people, transfer?.personId ?? null);
  const country = transfer ? countryByIso(transfer.iso2) : undefined;
  const rail = country?.rails.find((r) => r.id === transfer?.railId);

  const steps = useMemo(() => {
    if (!transfer || !country) return [];
    return [
      { id: 1, label: "Left your bank", detail: "Faster Payments · UK" },
      { id: 2, label: "Cush ledger", detail: "1.8% fee · mid-market FX" },
      { id: 3, label: "PAPSS settlement", detail: `${country.name} local currency` },
      { id: 4, label: rail?.name ?? "Payout", detail: person?.account ?? "" },
    ];
  }, [transfer, country, rail, person]);

  const [lit, setLit] = useState(1);

  useEffect(() => {
    setLit(1);
    const t1 = window.setTimeout(() => setLit(2), 700);
    const t2 = window.setTimeout(() => setLit(3), 1400);
    const t3 = window.setTimeout(() => {
      setLit(4);
      if (transfer) markComplete(transfer.id);
    }, 2100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transfer?.id]);

  if (!transfer || !person || !country) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-ink text-bone">
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-8">
        <p className="label-kicker text-champagne">On its way</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
          {person.name.split(" ")[0]} has{" "}
          {formatMoney(transfer.receiveAmount, transfer.receiveCurrency)}
        </h1>
        <p className="mt-2 text-sm text-bone/65">
          {receiptRef(transfer.id)} · {rail?.name} · {country.name}
        </p>

        <ol className="mt-10 space-y-4">
          {steps.map((s) => {
            const on = lit >= s.id;
            return (
              <li key={s.id} className="flex gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                    on ? "bg-champagne text-bone" : "bg-ink-2 text-bone/45",
                  )}
                >
                  {on ? <Check className="size-3.5" /> : s.id}
                </span>
                <div>
                  <p className={cn("font-semibold", on ? "text-bone" : "text-bone/45")}>
                    {s.label}
                  </p>
                  <p className="text-xs text-bone/55">{s.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="px-6 pb-16">
        <Button
          size="lg"
          block
          onClick={() => {
            setDraft({ step: "compose", receiptId: null, rateLockUntil: null });
            void navigate({ to: "/activity" });
          }}
        >
          Track this send
        </Button>
      </div>
    </div>
  );
}
