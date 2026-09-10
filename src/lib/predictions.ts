import type { Person, Transfer } from "@/lib/store";

export type PredictedSend = {
  person: Person;
  reason: string;
  urgency: "today" | "soon" | "later";
  daysUntil: number;
};

function daysUntilCadence(cadenceDay: number, now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth();
  let next = new Date(year, month, cadenceDay);
  next.setHours(10, 0, 0, 0);
  if (next.getTime() < now.getTime() - 12 * 60 * 60 * 1000) {
    next = new Date(year, month + 1, cadenceDay);
  }
  const diff = Math.round((next.getTime() - now.getTime()) / 86400000);
  return diff;
}

export function predictSends(people: Person[], now = new Date()): PredictedSend[] {
  return people
    .map((person) => {
      const daysUntil = daysUntilCadence(person.cadenceDay, now);
      let urgency: PredictedSend["urgency"] = "later";
      if (daysUntil <= 0) urgency = "today";
      else if (daysUntil <= 5) urgency = "soon";
      const dayLabel =
        daysUntil <= 0
          ? "today"
          : daysUntil === 1
            ? "tomorrow"
            : `in ${daysUntil} days`;
      const reason = `${person.usualPurpose} usually lands ${dayLabel}`;
      return { person, reason, urgency, daysUntil };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

export function purposeTotals(transfers: Transfer[], days = 90) {
  const since = Date.now() - days * 86400000;
  const map = new Map<string, number>();
  for (const t of transfers) {
    if (+new Date(t.createdAt) < since) continue;
    map.set(t.purpose, (map.get(t.purpose) ?? 0) + t.sendAmount);
  }
  return [...map.entries()]
    .map(([purpose, amount]) => ({ purpose, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function corridorTotals(transfers: Transfer[]) {
  const map = new Map<string, { iso2: string; amount: number; count: number }>();
  for (const t of transfers) {
    const row = map.get(t.iso2) ?? { iso2: t.iso2, amount: 0, count: 0 };
    row.amount += t.sendAmount;
    row.count += 1;
    map.set(t.iso2, row);
  }
  return [...map.values()].sort((a, b) => b.amount - a.amount);
}

export const SEASON_NOTES: { months: number[]; title: string; body: string }[] = [
  {
    months: [8, 9],
    title: "School-fee season",
    body: "September is when many families in Ghana, Kenya and Nigeria pay term fees. Sending a few days early avoids the weekend mobile-money crush.",
  },
  {
    months: [11],
    title: "Christmas corridors heat up",
    body: "West African wallets see the year’s busiest two weeks from mid-December. Rates are usually calmer now than they will be then.",
  },
  {
    months: [2, 3],
    title: "Ramadan support",
    body: "Sends to Senegal, Morocco, Egypt and northern Nigeria typically rise through Ramadan. Locking a rhythm now keeps you off the last-minute spike.",
  },
  {
    months: [0, 1],
    title: "New-year rent",
    body: "January rent and school re-openings pull cedi and naira volumes up. A standing send on the 10th beats a scramble on the 1st.",
  },
];

export function currentSeason(now = new Date()) {
  const m = now.getMonth();
  return SEASON_NOTES.find((s) => s.months.includes(m)) ?? SEASON_NOTES[0]!;
}

export function localTimingAdvice(input: {
  currency: string;
  countryName: string;
  vs7dPct: number;
  vs30dPct: number;
  purpose?: string;
  usualDay?: number;
  season?: string;
}): { headline: string; body: string; action: "send_now" | "wait" | "either" } {
  const stronger = input.vs30dPct >= 0.35;
  const softer = input.vs30dPct <= -0.8;
  const today = new Date().getDate();
  const dueToday = input.usualDay === today;

  if (dueToday) {
    return {
      action: "send_now",
      headline: `It’s the ${today}th — ${input.purpose ?? "the usual"} is due.`,
      body: `${input.currency} is ${input.vs30dPct >= 0 ? "a little stronger" : "a little softer"} than the 30-day average. The 1.8% fee does not move. Send so they have it today.`,
    };
  }
  if (stronger) {
    return {
      action: "send_now",
      headline: `${input.currency} is ${input.vs30dPct.toFixed(1)}% stronger than the month.`,
      body: `A send to ${input.countryName} now buys more local currency than your 30-day average. ${input.season ?? "Waiting a day is optional."}`,
    };
  }
  if (softer) {
    return {
      action: "either",
      headline: `${input.currency} is ${Math.abs(input.vs30dPct).toFixed(1)}% off the 30-day average.`,
      body: `If they need it, send — the fee is still 1.8%. If they can wait a day, the 7-day move is ${input.vs7dPct.toFixed(1)}%.`,
    };
  }
  return {
    action: "either",
    headline: `${input.currency} is quiet against your month.`,
    body: `Rate noise is under a percent. Send when they need it. ${input.season ?? ""}`.trim(),
  };
}
