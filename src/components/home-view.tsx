import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AskCush } from "@/components/ask-cush";
import { Flag } from "@/components/flag";
import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import { countryByIso } from "@/lib/countries";
import { formatMoney, formatRelative, greeting } from "@/lib/format";
import { predictSends, purposeTotals } from "@/lib/predictions";
import { pctChange, quoteAmount } from "@/lib/quote";
import { personById, useCush } from "@/lib/store";

export function HomeView() {
  const navigate = useNavigate();
  const profile = useCush((s) => s.profile);
  const people = useCush((s) => s.people);
  const transfers = useCush((s) => s.transfers);
  const startUsual = useCush((s) => s.startUsual);
  const [hello, setHello] = useState("Hello");

  useEffect(() => {
    setHello(greeting());
  }, []);

  const predicted = predictSends(people);
  const next = predicted[0];
  const recent = transfers.slice(0, 4);
  const purposes = purposeTotals(transfers);
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

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <img src="/images/logo-nav.png" alt="Cush" className="h-8 w-auto" />
        <Link
          to="/you"
          className="flex h-10 items-center gap-2 rounded-full bg-surface pr-3 pl-1.5 text-sm font-semibold shadow-border"
        >
          <PersonAvatar name={profile.firstName} size={28} />
          {profile.sendCurrency}
        </Link>
      </header>

      <div className="px-5">
        <p className="text-sm text-stone">{hello},</p>
        <h1 className="font-display text-[1.85rem] leading-none font-bold tracking-tight">
          {profile.firstName}
        </h1>
      </div>

      {next && nextQuote && nextCountry && (
        <section className="px-5 pt-5">
          <button
            type="button"
            onClick={sendUsual}
            className="w-full rounded-xl bg-ink p-5 text-left text-bone tap-press"
          >
            <p className="label-kicker text-champagne">
              {next.urgency === "today" ? "Send the usual · today" : "Coming up"}
            </p>
            <p className="mt-3 font-display text-[1.65rem] leading-tight font-bold tracking-tight text-bone">
              {next.person.name.split(" ")[0]} needs{" "}
              {formatMoney(next.person.usualReceive, nextCountry.currency, {
                compact: true,
              })}
            </p>
            <p className="mt-2 text-sm text-bone-2">
              {next.reason}. {nextRail?.name} · {nextCountry.name}.
            </p>
            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-bone/55">You pay</p>
                <p className="font-display text-lg font-semibold tabular text-bone">
                  {formatMoney(nextQuote.youPay, profile.sendCurrency)}
                </p>
                <p className="text-xs text-bone/55">
                  Fee {formatMoney(nextQuote.fee, profile.sendCurrency)} · 1.8%
                </p>
              </div>
              <span className="inline-flex h-11 items-center gap-1 rounded-full bg-champagne px-4 text-sm font-semibold text-bone">
                Send now
                <ArrowRight className="size-4" />
              </span>
            </div>
          </button>
        </section>
      )}

      <section className="px-5 pt-5">
        <AskCush />
      </section>

      <section className="px-5 pt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-base font-semibold">Rhythm</h2>
          <Link to="/people" className="text-sm font-semibold text-champagne">
            People
          </Link>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {predicted.slice(0, 3).map((p) => {
            const c = countryByIso(p.person.iso2);
            return (
              <button
                key={p.person.id}
                type="button"
                onClick={() => {
                  startUsual(p.person.id);
                  void navigate({ to: "/send" });
                }}
                className="flex items-center gap-3 rounded-lg bg-surface px-3 py-3 text-left shadow-border tap-press"
              >
                <PersonAvatar name={p.person.name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">
                    {p.person.name}
                    <span className="ml-1.5 font-normal text-ash">
                      {p.person.relation}
                    </span>
                  </p>
                  <p className="truncate text-xs text-stone">{p.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular">
                    {c
                      ? formatMoney(p.person.usualReceive, c.currency, {
                          compact: true,
                        })
                      : ""}
                  </p>
                  <p className="text-[11px] text-ash">
                    {p.daysUntil <= 0 ? "Today" : `${p.daysUntil}d`}
                  </p>
                </div>
              </button>
            );
          })}
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

      {purposes.length > 0 && (
        <section className="px-5 pt-6">
          <h2 className="font-display text-base font-semibold">This quarter</h2>
          <p className="mt-1 text-sm text-stone">
            Where the money went — so the next send is a tap, not a form.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {purposes.map((p) => (
              <span
                key={p.purpose}
                className="rounded-full bg-bone-2 px-3 py-1.5 text-sm font-medium text-ink"
              >
                {p.purpose}
                <span className="ml-1.5 text-stone">
                  {formatMoney(p.amount, profile.sendCurrency, { compact: true })}
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="px-5 pt-6 pb-8">
        <h2 className="font-display text-base font-semibold">Recent</h2>
        <div className="mt-3 divide-y divide-line overflow-hidden rounded-lg bg-surface shadow-border">
          {recent.map((t) => {
            const person = personById(people, t.personId);
            return (
              <div key={t.id} className="flex items-center gap-3 px-3 py-3">
                <PersonAvatar name={person?.name ?? "Cush"} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {person?.name ?? "Recipient"}
                  </p>
                  <p className="text-xs text-ash">
                    {t.purpose} · {formatRelative(t.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular">
                    {formatMoney(t.receiveAmount, t.receiveCurrency, {
                      compact: true,
                    })}
                  </p>
                  <p className="text-[11px] text-ash">Arrived</p>
                </div>
              </div>
            );
          })}
        </div>
        <Button
          variant="outline"
          block
          className="mt-4"
          onClick={() => void navigate({ to: "/send" })}
        >
          New send
          <ChevronRight className="size-4" />
        </Button>
      </section>
    </div>
  );
}
