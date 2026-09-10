const SYMBOL: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  GHS: "GH₵",
  NGN: "₦",
  KES: "KSh",
  ZAR: "R",
  EGP: "E£",
  MAD: "MAD",
  TND: "DT",
  XOF: "CFA",
  XAF: "FCFA",
  ETB: "Br",
  TZS: "TSh",
  UGX: "USh",
  RWF: "FRw",
  MUR: "Rs",
  MZN: "MT",
  ZMW: "ZK",
  BWP: "P",
  NAD: "N$",
  AOA: "Kz",
  MGA: "Ar",
  MWK: "MK",
  LSL: "L",
  SZL: "E",
  CDF: "FC",
  GNF: "FG",
  SLL: "Le",
  SLE: "Le",
  LRD: "L$",
  GMD: "D",
  CVE: "$",
  DJF: "Fdj",
  SOS: "Sh",
  SSP: "£",
  SDG: "SDG",
  ERN: "Nfk",
  LYD: "LD",
  DZD: "DA",
  MRU: "UM",
  KMF: "CF",
  SCR: "SR",
  STN: "Db",
  BIF: "FBu",
  ZWG: "ZiG",
};

export function currencySymbol(code: string) {
  return SYMBOL[code] ?? code + " ";
}

export function formatMoney(amount: number, code: string, opts?: { compact?: boolean }) {
  if (!Number.isFinite(amount)) return "—";
  const symbol = currencySymbol(code);
  const abs = Math.abs(amount);
  const digits = abs >= 1000 ? 2 : abs >= 100 ? 2 : abs >= 1 ? 2 : 4;
  if (opts?.compact && abs >= 10000) {
    const compact = new Intl.NumberFormat("en-GB", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
    return `${symbol}${compact}`;
  }
  const formatted = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(amount);
  if (["XOF", "XAF", "GHS", "NGN", "KES", "TZS", "UGX", "RWF"].includes(code)) {
    return `${symbol} ${formatted}`;
  }
  return `${symbol}${formatted}`;
}

export function formatRate(from: string, to: string, rate: number) {
  return `1 ${from} = ${rate.toLocaleString("en-GB", { maximumFractionDigits: 4 })} ${to}`;
}

export function formatRelative(iso: string, now = new Date()) {
  const then = new Date(iso);
  const diff = now.getTime() - then.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 14) return `${days}d ago`;
  return then.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 5) return "Good evening";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "C";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}
