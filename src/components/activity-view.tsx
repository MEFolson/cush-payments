import { useMemo, useState } from "react";
import { Flag } from "@/components/flag";
import { PersonAvatar } from "@/components/person-avatar";
import { receiptRef } from "@/lib/compliance";
import { countryByIso } from "@/lib/countries";
import { formatMoney, formatRelative } from "@/lib/format";
import { personById, useCush, type TransferStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

const FILTERS: { id: "all" | TransferStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sent", label: "On the rail" },
  { id: "complete", label: "Arrived" },
];

export function ActivityView() {
  const profile = useCush((s) => s.profile);
  const people = useCush((s) => s.people);
  const transfers = useCush((s) => s.transfers);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(
    () =>
      transfers.filter((t) => {
        if (filter === "all") return true;
        if (filter === "sent") return t.status !== "complete";
        return t.status === filter;
      }),
    [transfers, filter],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header className="px-5 pt-2 pb-3">
        <p className="label-kicker text-champagne">Activity</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">Track</h1>
        <p className="mt-1 text-sm text-stone">
          Faster Payments out. PAPSS in. Every hop on one timeline.
        </p>
      </header>

      <div className="flex gap-2 overflow-x-auto px-5 pb-3">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "h-9 shrink-0 rounded-full px-4 text-sm font-semibold tap-press",
              filter === f.id ? "bg-ink text-bone" : "bg-surface text-stone shadow-border",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2 px-5 pb-10">
        {list.length === 0 && (
          <p className="rounded-[20px] bg-surface px-4 py-8 text-center text-sm text-stone shadow-border">
            No sends in this filter.
          </p>
        )}
        {list.map((t) => {
          const person = personById(people, t.personId);
          const country = countryByIso(t.iso2);
          const rail = country?.rails.find((r) => r.id === t.railId);
          const open = openId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setOpenId(open ? null : t.id)}
              className="w-full rounded-[20px] bg-surface p-4 text-left shadow-border tap-press"
            >
              <div className="flex items-center gap-3">
                <PersonAvatar name={person?.name ?? "Cush"} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{person?.name ?? "Recipient"}</p>
                  <p className="flex items-center gap-1.5 text-xs text-stone">
                    <Flag iso2={t.iso2} size={12} />
                    {rail?.name} · {formatRelative(t.createdAt)}
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
              {open && (
                <dl className="mt-4 space-y-2 border-t border-line pt-3 text-sm">
                  <Row
                    k="You sent"
                    v={formatMoney(t.sendAmount, t.sendCurrency)}
                  />
                  <Row k="Fee" v={formatMoney(t.fee, profile.sendCurrency)} />
                  <Row k="Purpose" v={t.purpose} />
                  <Row k="Reference" v={receiptRef(t.id)} />
                  <Row k="Rail" v={`UK bank → Cush → PAPSS → ${rail?.name ?? "payout"}`} />
                </dl>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-stone">{k}</dt>
      <dd className="text-right font-semibold text-ink">{v}</dd>
    </div>
  );
}
