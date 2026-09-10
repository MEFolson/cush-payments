import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AskCush } from "@/components/ask-cush";
import { Flag } from "@/components/flag";
import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import { LIMITS, spendInDays } from "@/lib/compliance";
import { countryByIso } from "@/lib/countries";
import { formatMoney, formatRelative, greeting } from "@/lib/format";
import { predictSends } from "@/lib/predictions";
import { pctChange, quoteAmount } from "@/lib/quote";
import { personById, useCush } from "@/lib/store";

export function HomeView() {
  const navigate = useNavigate();
  const profile = useCush((s) => s.profile);
  const people = useCush((s) => s.people);
  const transfers = useCush((s) => s.transfers);
  const platform = useCush((s) => s.platform);
  const startUsual = useCush((s) => s.startUsual);
  const resetDraft = useCush((s) => s.resetDraft);
  const [hello, setHello] = useState("Hello");

  useEffect(() => {
    setHello(greeting());
  }, []);

  const predicted = predictSends(people);
  const next = predicted[0];
  const recent = transfers.slice(0, 3);
  const daySpend = spendInDays(transfers, 1, profile.sendCurrency);
  const nextQuote =
    next &&
    quoteAmount({
      iso2: next.person.iso2,
      sendCurrency: profile.sendCurrency,
      mode: "they_receive",
      amount: next.person.usualReceive,
    });
  const nextCountry = next ? countryByIso(next.person.iso2) : undefined;
  const nextRail = nextCountry?.rails.find((r) => r.id === next?.person.railId);

  const corridors = [
    { iso2: "gh", label: "GHS" },
    { iso2: "ng", label: "NGN" },
    { iso2: "ke", label: "KES" },
  ].map((c) => ({
    ...c,
    change: pctChange(c.iso2, profile.sendCurrency, 7),
  }));

  function sendUsual() {
    if (!next) return;
    startUsual(next.person.id);
    void navigate({ to: "/send" });
  }

  function newSend() {
    resetDraft();
    void navigate({ to: "/send" });
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header className="flex items-end justify-between px-5 pt-2 pb-3">
        <div>
          <p className="text-sm text-stone">{hello}</p>
          <h1 className="font-display text-[1.75rem] leading-none font-bold tracking-tight">
            {profile.firstName}
          </h1>
        </div>
        <Link
          to="/you"
          className="flex h-10 items-center gap-2 rounded-full bg-surface pr-3 pl-1.5 text-sm font-semibold shadow-border"
        >
          <PersonAvatar name={`${profile.firstName} ${profile.lastName}`} size={28} />
          {profile.kycVerified ? "Verified" : profile.sendCurrency}
        </Link>
      </header>

      {next && nextQuote && nextCountry && (
        <section className="px-5 pt-2">
          <button
            type="button"
            onClick={sendUsual}
            className="w-full rounded-[20px] bg-ink p-5 text-left text-bone tap-press"
          >
            <p className="label-kicker text-champagne">
              {next.urgency === "today" ? "Due today" : "Send the usual"}
            </p>
            <p className="mt-3 font-display text-[1.55rem] leading-tight font-bold tracking-tight">
              {next.person.name.split(" ")[0]} needs{" "}
              {formatMoney(next.person.usualReceive, nextCountry.currency, {
                compact: true,
              })}
            </p>
            <p className="mt-2 text-sm text-bone/65">
              {next.reason}. {nextRail?.name} · {nextCountry.name}.
            </p>
            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-bone/50">You pay · 1.8%</p>
                <p className="font-display text-lg font-semibold tabular">
                  {formatMoney(nextQuote.youPay, profile.sendCurrency)}
                </p>
              </div>
              <span className="inline-flex h-11 items-center gap-1 rounded-full bg-champagne px-4 text-sm font-semibold">
                Review
                <ArrowRight className="size-4" />
              </span>
            </div>
          </button>
        </section>
      )}

      <section className="px-5 pt-5">
        <AskCush />
      </section>

      <section className="px-5 pt-5">
        <div className="rounded-[20px] bg-surface px-4 py-3 shadow-border">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold text-stone">Daily limit</p>
            <p className="font-mono text-xs tabular text-ash">
              {formatMoney(daySpend, profile.sendCurrency)} /{" "}
              {LIMITS.daily.toLocaleString("en-GB")} {profile.sendCurrency}
            </p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bone-2">
            <div
              className="h-full rounded-full bg-champagne"
              style={{
                width: `${Math.min(100, (daySpend / LIMITS.daily) * 100)}%`,
              }}
            />
          </div>
        </div>
      </section>

      <section className="px-5 pt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-base font-semibold">Pulse</h2>
          <Link to="/pulse" className="text-sm font-semibold text-champagne">
            Trends
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {corridors.map((c) => (
            <Link
              key={c.iso2}
              to="/pulse"
              className="rounded-lg bg-surface p-3 shadow-border"
            >
              <div className="flex items-center gap-1.5">
                <Flag iso2={c.iso2} size={16} />
                <span className="text-xs font-semibold">{c.label}</span>
              </div>
              <p
                className={`mt-2 font-mono text-sm tabular ${c.change >= 0 ? "text-success" : "text-destructive"}`}
              >
                {c.change >= 0 ? "+" : ""}
                {c.change.toFixed(1)}%
              </p>
              <p className="text-[11px] text-ash">7 days</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pt-6 pb-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-base font-semibold">Recent</h2>
          <Link to="/activity" className="text-sm font-semibold text-champagne">
            All
          </Link>
        </div>
        <div className="mt-3 divide-y divide-line overflow-hidden rounded-[20px] bg-surface shadow-border">
          {recent.map((t) => {
            const person = personById(people, t.personId);
            return (
              <div key={t.id} className="flex items-center gap-3 px-3 py-3">
                <PersonAvatar name={person?.name ?? "Cush"} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{person?.name ?? "Recipient"}</p>
                  <p className="text-xs text-ash">
                    {t.purpose} · {formatRelative(t.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular">
                    {formatMoney(t.receiveAmount, t.receiveCurrency, { compact: true })}
                  </p>
                  <p className="text-[11px] text-ash">
                    {t.status === "complete" ? "Arrived" : "On the rail"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {platform === "ios" && (
          <Button variant="ink" block className="mt-4" onClick={newSend}>
            New send
            <ChevronRight className="size-4" />
          </Button>
        )}
      </section>

      {platform === "ios" && (
        <button
          type="button"
          onClick={newSend}
          aria-label="New send"
          className="absolute right-5 bottom-4 flex size-14 items-center justify-center rounded-full bg-champagne text-bone shadow-cta tap-press"
        >
          <Plus className="size-6" strokeWidth={2.4} />
        </button>
      )}
    </div>
  );
}
