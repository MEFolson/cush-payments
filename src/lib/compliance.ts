import type { SendCurrency } from "@/lib/countries";
import type { Person, Transfer } from "@/lib/store";

/** Illustrative FCA EMI / PSP send limits in the user's send currency. */
export const LIMITS = {
  single: 8_000,
  daily: 5_000,
  monthly: 25_000,
} as const;

export const RATE_LOCK_MS = 30_000;
export const DEMO_PASSCODE = "2580";

export function spendInDays(
  transfers: Transfer[],
  days: number,
  currency: SendCurrency,
  now = Date.now(),
) {
  const since = now - days * 86_400_000;
  return transfers
    .filter((t) => t.sendCurrency === currency && +new Date(t.createdAt) >= since)
    .reduce((sum, t) => sum + t.sendAmount, 0);
}

export function limitCheck(input: {
  sendAmount: number;
  sendCurrency: SendCurrency;
  transfers: Transfer[];
}): { ok: true } | { ok: false; reason: string } {
  const { sendAmount, sendCurrency, transfers } = input;
  if (sendAmount > LIMITS.single) {
    return {
      ok: false,
      reason: `Single-send limit is ${LIMITS.single.toLocaleString("en-GB")} ${sendCurrency}. Split the send or raise limits in-app after extra checks.`,
    };
  }
  const day = spendInDays(transfers, 1, sendCurrency);
  if (day + sendAmount > LIMITS.daily) {
    return {
      ok: false,
      reason: `Daily limit remaining: ${(LIMITS.daily - day).toLocaleString("en-GB")} ${sendCurrency}.`,
    };
  }
  const month = spendInDays(transfers, 30, sendCurrency);
  if (month + sendAmount > LIMITS.monthly) {
    return {
      ok: false,
      reason: `Monthly limit remaining: ${(LIMITS.monthly - month).toLocaleString("en-GB")} ${sendCurrency}.`,
    };
  }
  return { ok: true };
}

/** Simulated instant name enquiry on African mobile-money / bank rails. */
export function nameEnquiry(person: Person): {
  matched: boolean;
  legalName: string;
  method: string;
} {
  return {
    matched: person.account.trim().length > 4,
    legalName: person.name.toUpperCase(),
    method: person.railId === "bank" ? "Bank account name check" : "Wallet name enquiry",
  };
}

export function receiptRef(id: string) {
  const tail = id.replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase();
  return `CSH-${tail || "000000"}`;
}

export const SOURCE_OF_FUNDS = [
  "Salary",
  "Savings",
  "Business income",
  "Family support",
] as const;

export const OCCUPATIONS = [
  "Employed",
  "Self-employed",
  "Student",
  "Retired",
] as const;
