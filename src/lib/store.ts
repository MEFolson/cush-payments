import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEMO_PASSCODE, RATE_LOCK_MS } from "@/lib/compliance";
import type { SendCurrency } from "@/lib/countries";
import type { Platform } from "@/lib/platform";
import type { QuoteMode } from "@/lib/quote";

export type Person = {
  id: string;
  name: string;
  relation: string;
  iso2: string;
  railId: string;
  account: string;
  usualReceive: number;
  usualPurpose: string;
  cadenceDay: number;
};

export type TransferStatus = "sent" | "payout" | "complete";

export type Transfer = {
  id: string;
  personId: string;
  iso2: string;
  railId: string;
  sendAmount: number;
  sendCurrency: SendCurrency;
  receiveAmount: number;
  receiveCurrency: string;
  fee: number;
  rate: number;
  purpose: string;
  status: TransferStatus;
  createdAt: string;
};

export type DraftStep = "compose" | "review" | "sca" | "receipt";

export type Draft = {
  personId: string | null;
  iso2: string;
  railId: string;
  mode: QuoteMode;
  amount: string;
  purpose: string;
  step: DraftStep;
  receiptId: string | null;
  rateLockUntil: number | null;
};

export type Profile = {
  firstName: string;
  lastName: string;
  sendCurrency: SendCurrency;
  city: string;
  nationality: string;
  occupation: string;
  sourceOfFunds: string;
  dob: string;
  onboarded: boolean;
  kycVerified: boolean;
  passcode: string;
  biometrics: boolean;
};

type CushState = {
  profile: Profile;
  platform: Platform;
  people: Person[];
  transfers: Transfer[];
  draft: Draft;
  hydrated: boolean;
  unlocked: boolean;
  setHydrated: () => void;
  setPlatform: (p: Platform) => void;
  unlock: () => void;
  lock: () => void;
  completeOnboarding: (p: {
    firstName: string;
    lastName: string;
    sendCurrency: SendCurrency;
    city: string;
    nationality: string;
    occupation: string;
    sourceOfFunds: string;
    dob: string;
    passcode: string;
    biometrics: boolean;
  }) => void;
  setSendCurrency: (c: SendCurrency) => void;
  setBiometrics: (on: boolean) => void;
  setDraft: (partial: Partial<Draft>) => void;
  resetDraft: () => void;
  startUsual: (personId: string) => void;
  beginReview: () => void;
  addPerson: (p: Omit<Person, "id">) => string;
  addTransfer: (t: Omit<Transfer, "id" | "createdAt" | "status">) => Transfer;
  markComplete: (id: string) => void;
  resetDemo: () => void;
};

const ama: Person = {
  id: "p-ama",
  name: "Ama Mensah",
  relation: "Mum",
  iso2: "gh",
  railId: "mtn",
  account: "MTN · 0244 12 4408",
  usualReceive: 3800,
  usualPurpose: "Rent",
  cadenceDay: 10,
};
const chinedu: Person = {
  id: "p-chinedu",
  name: "Chinedu Okonkwo",
  relation: "Brother",
  iso2: "ng",
  railId: "bank",
  account: "Access · 0123456789",
  usualReceive: 180000,
  usualPurpose: "Family",
  cadenceDay: 28,
};
const wanjiku: Person = {
  id: "p-wanjiku",
  name: "Wanjiku Kamau",
  relation: "Cousin",
  iso2: "ke",
  railId: "mpesa",
  account: "M-Pesa · 0712 334 091",
  usualReceive: 18500,
  usualPurpose: "School",
  cadenceDay: 15,
};
const fatou: Person = {
  id: "p-fatou",
  name: "Fatou Diallo",
  relation: "Aunt",
  iso2: "sn",
  railId: "wave",
  account: "Wave · 77 512 09 44",
  usualReceive: 75000,
  usualPurpose: "Family",
  cadenceDay: 1,
};
const thabo: Person = {
  id: "p-thabo",
  name: "Thabo Nkosi",
  relation: "Friend",
  iso2: "za",
  railId: "capitec",
  account: "Capitec · 1594 22 1180",
  usualReceive: 2400,
  usualPurpose: "Family",
  cadenceDay: 20,
};

const DEFAULT_PEOPLE = [ama, chinedu, wanjiku, fatou, thabo];

function isoDaysAgo(days: number, hour = 9) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 12, 0, 0);
  return d.toISOString();
}

function seedTransfers(): Transfer[] {
  const rows: Transfer[] = [];
  const amaMonths = [0, 31, 61, 92, 122, 153];
  amaMonths.forEach((days, i) => {
    rows.push({
      id: `t-ama-${i}`,
      personId: ama.id,
      iso2: "gh",
      railId: "mtn",
      sendAmount: 248.4 + i * 1.1,
      sendCurrency: "GBP",
      receiveAmount: 3800,
      receiveCurrency: "GHS",
      fee: 4.47,
      rate: 15.16,
      purpose: "Rent",
      status: "complete",
      createdAt: isoDaysAgo(days + 1, 10),
    });
  });
  rows.push({
    id: "t-chi-1",
    personId: chinedu.id,
    iso2: "ng",
    railId: "bank",
    sendAmount: 95.2,
    sendCurrency: "GBP",
    receiveAmount: 180000,
    receiveCurrency: "NGN",
    fee: 1.71,
    rate: 1924,
    purpose: "Family",
    status: "complete",
    createdAt: isoDaysAgo(12, 18),
  });
  rows.push({
    id: "t-wan-1",
    personId: wanjiku.id,
    iso2: "ke",
    railId: "mpesa",
    sendAmount: 112.6,
    sendCurrency: "GBP",
    receiveAmount: 18500,
    receiveCurrency: "KES",
    fee: 2.03,
    rate: 167.4,
    purpose: "School",
    status: "complete",
    createdAt: isoDaysAgo(26, 8),
  });
  rows.push({
    id: "t-fat-1",
    personId: fatou.id,
    iso2: "sn",
    railId: "wave",
    sendAmount: 96.4,
    sendCurrency: "GBP",
    receiveAmount: 75000,
    receiveCurrency: "XOF",
    fee: 1.74,
    rate: 790,
    purpose: "Family",
    status: "complete",
    createdAt: isoDaysAgo(40, 14),
  });
  return rows.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

const emptyDraft = (): Draft => ({
  personId: ama.id,
  iso2: "gh",
  railId: "mtn",
  mode: "they_receive",
  amount: "3800",
  purpose: "Rent",
  step: "compose",
  receiptId: null,
  rateLockUntil: null,
});

const defaultProfile = (): Profile => ({
  firstName: "Kwame",
  lastName: "Mensah",
  sendCurrency: "GBP",
  city: "London",
  nationality: "GB",
  occupation: "Employed",
  sourceOfFunds: "Salary",
  dob: "1992-04-18",
  onboarded: false,
  kycVerified: false,
  passcode: DEMO_PASSCODE,
  biometrics: true,
});

export const useCush = create<CushState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile(),
      platform: "ios",
      people: DEFAULT_PEOPLE,
      transfers: seedTransfers(),
      draft: emptyDraft(),
      hydrated: false,
      unlocked: false,
      setHydrated: () => set({ hydrated: true }),
      setPlatform: (platform) => set({ platform }),
      unlock: () => set({ unlocked: true }),
      lock: () => set({ unlocked: false }),
      completeOnboarding: (p) =>
        set({
          profile: {
            firstName: p.firstName.trim() || "Kwame",
            lastName: p.lastName.trim() || "Mensah",
            sendCurrency: p.sendCurrency,
            city: p.city.trim() || "London",
            nationality: p.nationality,
            occupation: p.occupation,
            sourceOfFunds: p.sourceOfFunds,
            dob: p.dob,
            onboarded: true,
            kycVerified: true,
            passcode: p.passcode || DEMO_PASSCODE,
            biometrics: p.biometrics,
          },
          unlocked: true,
        }),
      setSendCurrency: (sendCurrency) =>
        set({ profile: { ...get().profile, sendCurrency } }),
      setBiometrics: (biometrics) =>
        set({ profile: { ...get().profile, biometrics } }),
      setDraft: (partial) => set({ draft: { ...get().draft, ...partial } }),
      resetDraft: () => set({ draft: emptyDraft() }),
      startUsual: (personId) => {
        const person = get().people.find((p) => p.id === personId);
        if (!person) return;
        set({
          draft: {
            personId: person.id,
            iso2: person.iso2,
            railId: person.railId,
            mode: "they_receive",
            amount: String(person.usualReceive),
            purpose: person.usualPurpose,
            step: "review",
            receiptId: null,
            rateLockUntil: Date.now() + RATE_LOCK_MS,
          },
        });
      },
      beginReview: () =>
        set({
          draft: {
            ...get().draft,
            step: "review",
            rateLockUntil: Date.now() + RATE_LOCK_MS,
          },
        }),
      addPerson: (p) => {
        const id = `p-${Math.random().toString(36).slice(2, 9)}`;
        set({ people: [{ ...p, id }, ...get().people] });
        return id;
      },
      addTransfer: (t) => {
        const transfer: Transfer = {
          ...t,
          id: `t-${Math.random().toString(36).slice(2, 9)}`,
          createdAt: new Date().toISOString(),
          status: "sent",
        };
        set({
          transfers: [transfer, ...get().transfers],
          draft: {
            ...get().draft,
            step: "receipt",
            receiptId: transfer.id,
            rateLockUntil: null,
          },
        });
        return transfer;
      },
      markComplete: (id) =>
        set({
          transfers: get().transfers.map((t) =>
            t.id === id ? { ...t, status: "complete" } : t,
          ),
        }),
      resetDemo: () =>
        set({
          profile: { ...defaultProfile(), onboarded: true, kycVerified: true },
          people: DEFAULT_PEOPLE,
          transfers: seedTransfers(),
          draft: emptyDraft(),
          unlocked: true,
        }),
    }),
    {
      name: "cush-native-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        profile: s.profile,
        platform: s.platform,
        people: s.people,
        transfers: s.transfers,
      }),
      skipHydration: true,
    },
  ),
);

export function personById(people: Person[], id: string | null) {
  if (!id) return undefined;
  return people.find((p) => p.id === id);
}
