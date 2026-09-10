import {
  COUNTRY_BY_ISO,
  FX_TO_GBP,
  type SendCurrency,
} from "@/lib/countries";

export const FEE_RATE = 0.018;
export const TYPICAL_COMPETITOR_RATE = 0.065;

function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic mid-market local units per 1 unit of send currency. */
export function midRate(iso2: string, send: SendCurrency, dayOffset = 0) {
  const country = COUNTRY_BY_ISO[iso2.toLowerCase()];
  if (!country) return 0;
  const gbpPerSend = FX_TO_GBP[send];
  const base = country.gbpRate * gbpPerSend;
  const h = hash(country.currency + send);
  const phase = (h % 628) / 100;
  const drift = Math.sin(dayOffset / 5.1 + phase) * 0.011;
  const noise = ((hash(country.currency + String(dayOffset)) % 1000) / 1000 - 0.5) * 0.005;
  return base * (1 + drift + noise);
}

export function rateSeries(iso2: string, send: SendCurrency, days = 30) {
  const points: { day: number; rate: number; label: string }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    points.push({
      day: days - 1 - i,
      rate: midRate(iso2, send, -i),
      label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    });
  }
  return points;
}

export type QuoteMode = "they_receive" | "you_send";

export type Quote = {
  mode: QuoteMode;
  sendCurrency: SendCurrency;
  receiveCurrency: string;
  iso2: string;
  sendAmount: number;
  receiveAmount: number;
  fee: number;
  rate: number;
  youPay: number;
  competitorReceive: number;
  extraForFamily: number;
  vs30dPct: number;
};

export function quoteAmount(input: {
  iso2: string;
  sendCurrency: SendCurrency;
  mode: QuoteMode;
  amount: number;
}): Quote | null {
  const country = COUNTRY_BY_ISO[input.iso2.toLowerCase()];
  if (!country || !Number.isFinite(input.amount) || input.amount <= 0) return null;
  const rate = midRate(input.iso2, input.sendCurrency, 0);
  const avg30 = midRate(input.iso2, input.sendCurrency, -15);
  const vs30dPct = avg30 ? ((rate - avg30) / avg30) * 100 : 0;

  let sendAmount: number;
  let receiveAmount: number;
  let fee: number;

  if (input.mode === "they_receive") {
    receiveAmount = input.amount;
    sendAmount = receiveAmount / rate / (1 - FEE_RATE);
    fee = sendAmount * FEE_RATE;
  } else {
    sendAmount = input.amount;
    fee = sendAmount * FEE_RATE;
    receiveAmount = (sendAmount - fee) * rate;
  }

  const youPay = sendAmount;
  const afterCompetitorFee = sendAmount * (1 - TYPICAL_COMPETITOR_RATE);
  const competitorReceive = afterCompetitorFee * rate * 0.992;
  const extraForFamily = receiveAmount - competitorReceive;

  return {
    mode: input.mode,
    sendCurrency: input.sendCurrency,
    receiveCurrency: country.currency,
    iso2: input.iso2,
    sendAmount,
    receiveAmount,
    fee,
    rate,
    youPay,
    competitorReceive,
    extraForFamily,
    vs30dPct,
  };
}

export function pctChange(iso2: string, send: SendCurrency, days = 7) {
  const now = midRate(iso2, send, 0);
  const then = midRate(iso2, send, -days);
  if (!then) return 0;
  return ((now - then) / then) * 100;
}
