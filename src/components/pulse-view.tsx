import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Flag } from "@/components/flag";
import { Button } from "@/components/ui/button";
import { adviseSendTiming } from "@/lib/ai";
import { COUNTRIES, countryByIso } from "@/lib/countries";
import { formatMoney, formatRate } from "@/lib/format";
import { currentSeason, corridorTotals, localTimingAdvice } from "@/lib/predictions";
import { midRate, pctChange, quoteAmount, rateSeries } from "@/lib/quote";
import { useCush } from "@/lib/store";
import { cn } from "@/lib/utils";

export function PulseView() {
  const navigate = useNavigate();
  const profile = useCush((s) => s.profile);
  const people = useCush((s) => s.people);
  const transfers = useCush((s) => s.transfers);
  const [iso2, setIso2] = useState(people[0]?.iso2 ?? "gh");
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const [advice, setAdvice] = useState<{
    headline: string;
    body: string;
    action: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const country = countryByIso(iso2)!;
  const series = useMemo(
    () => rateSeries(iso2, profile.sendCurrency, 30),
    [iso2, profile.sendCurrency],
  );
  const change7 = pctChange(iso2, profile.sendCurrency, 7);
  const change30 = pctChange(iso2, profile.sendCurrency, 30);
  const rate = midRate(iso2, profile.sendCurrency, 0);
  const season = currentSeason();
  const yours = corridorTotals(transfers);
  const sample = quoteAmount({
    iso2,
    sendCurrency: profile.sendCurrency,
    mode: "you_send",
    amount: 250,
  });

  const list = COUNTRIES.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.currency.toLowerCase().includes(q.toLowerCase()),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  async function ask() {
    setError(null);
    const person = people.find((p) => p.iso2 === iso2);
    const local = localTimingAdvice({
      currency: country.currency,
      countryName: country.name,
      vs7dPct: change7,
      vs30dPct: change30,
      purpose: person?.usualPurpose,
      usualDay: person?.cadenceDay,
      season: season.title,
    });
    setAdvice(local);
    setBusy(true);
    try {
      const result = await adviseSendTiming({
        data: {
          iso2,
          countryName: country.name,
          currency: country.currency,
          sendCurrency: profile.sendCurrency,
          rate,
          vs7dPct: change7,
          vs30dPct: change30,
          purpose: person?.usualPurpose,
          usualDay: person?.cadenceDay,
          season: season.title,
        },
      });
      if (result.ok) {
        setAdvice(result);
      }
    } catch {
      // Keep the instant local read.
    } finally {
      setBusy(false);
    }
  }

  return (
    <div ref={scroller} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header className="px-5 pt-2 pb-2">
        <button
          type="button"
          onClick={() => void navigate({ to: "/" })}
          className="-ml-2 mb-1 flex size-11 items-center justify-center rounded-full tap-press"
          aria-label="Back"
        >
          <ChevronLeft className="size-6" />
        </button>
        <p className="label-kicker text-champagne">Pulse</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">
          When to send
        </h1>
        <p className="mt-1 text-sm text-stone">
          Mid-market rates. No markup. The 1.8% fee does not move with the chart.
        </p>
      </header>

      <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
        {(yours.length ? yours : [{ iso2: "gh" }, { iso2: "ng" }, { iso2: "ke" }]).map(
          (c) => {
            const co = countryByIso(c.iso2);
            if (!co) return null;
            const active = iso2 === c.iso2;
            return (
              <button
                key={c.iso2}
                type="button"
                onClick={() => {
                  setIso2(c.iso2);
                  setAdvice(null);
                }}
                className={cn(
                  "flex h-10 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-semibold tap-press",
                  active ? "bg-ink text-bone" : "bg-surface text-ink shadow-border",
                )}
              >
                <Flag iso2={c.iso2} size={16} />
                {co.currency}
              </button>
            );
          },
        )}
      </div>

      <section className="px-5 pt-4">
        <div className="rounded-xl bg-surface p-4 shadow-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-stone">
                {country.name} · {country.currency}
              </p>
              <p className="mt-1 font-display text-xl font-bold tabular">
                {formatRate(profile.sendCurrency, country.currency, rate)}
              </p>
            </div>
            <p
              className={cn(
                "font-mono text-sm tabular",
                change7 >= 0 ? "text-success" : "text-destructive",
              )}
            >
              {change7 >= 0 ? "+" : ""}
              {change7.toFixed(2)}% 7d
            </p>
          </div>
          <div className="mt-3 h-36">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(23,20,17,0.06)" vertical={false} />
                  <XAxis dataKey="label" hide />
                  <YAxis domain={["auto", "auto"]} hide />
                  <Tooltip
                    contentStyle={{
                      background: "#fffcf8",
                      border: "1px solid #1714111a",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    formatter={(v) => [
                      Number(v).toLocaleString("en-GB", { maximumFractionDigits: 4 }),
                      country.currency,
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#e85d04"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : null}
          </div>
          <div className="mt-2 flex justify-between text-xs text-ash">
            <span>30-day {change30 >= 0 ? "up" : "down"} {Math.abs(change30).toFixed(1)}%</span>
            {sample && (
              <span>
                £250 → {formatMoney(sample.receiveAmount, sample.receiveCurrency, { compact: true })}
              </span>
            )}
          </div>
        </div>

        <Button
          variant="ink"
          block
          className="mt-3"
          disabled={busy}
          onClick={() => void ask()}
        >
          {busy ? "Reading the corridor…" : `Should I send ${country.currency} now?`}
        </Button>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        {advice && (
          <div className="mt-3 rounded-lg bg-ink p-4 text-bone">
            <p className="label-kicker text-champagne">
              {advice.action === "send_now"
                ? "Send now"
                : advice.action === "wait"
                  ? "Wait a day"
                  : "Your call"}
            </p>
            <p className="mt-2 font-display text-lg font-semibold">{advice.headline}</p>
            <p className="mt-1 text-sm text-bone-2">{advice.body}</p>
          </div>
        )}
      </section>

      <section className="px-5 pt-6">
        <h2 className="font-display text-base font-semibold">{season.title}</h2>
        <p className="mt-1 text-sm text-stone">{season.body}</p>
      </section>

      <section className="px-5 pt-6 pb-8">
        <h2 className="font-display text-base font-semibold">All 54 markets</h2>
        <p className="mt-1 text-sm text-stone">
          Licensed payouts to every African country — wallet or bank.
        </p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find a country"
          className="mt-3 h-12 w-full rounded-full bg-surface px-4 text-sm shadow-border outline-none"
        />
        <div className="mt-3 divide-y divide-line overflow-hidden rounded-lg bg-surface shadow-border">
          {list.map((c) => {
            const ch = pctChange(c.iso2, profile.sendCurrency, 7);
            return (
              <button
                key={c.iso2}
                type="button"
                onClick={() => {
                  setIso2(c.iso2);
                  setAdvice(null);
                  scroller.current?.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex w-full items-center gap-3 px-3 py-3 text-left"
              >
                <Flag iso2={c.iso2} size={28} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{c.name}</p>
                  <p className="truncate text-xs text-ash">
                    {c.currency} · {c.rails[0]?.name} · {c.regulator}
                  </p>
                </div>
                <span
                  className={cn(
                    "font-mono text-xs tabular",
                    ch >= 0 ? "text-success" : "text-destructive",
                  )}
                >
                  {ch >= 0 ? "+" : ""}
                  {ch.toFixed(1)}%
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
