<p align="center">
  <img src="assets/logo.svg" alt="Cush Payments Logo" width="120" height="120">
</p>

<h1 align="center">Cush Payments</h1>

<p align="center">
  <strong>AI-native regulated African payments & core banking platform</strong><br>
  Instant, transparent remittances for the African diaspora · Cush Core platform licensing
</p>

<p align="center">
  <a href="https://cushpayments.co.uk"><img src="https://img.shields.io/badge/Website-cushpayments.co.uk-black?style=for-the-badge" alt="Website"></a>
  <a href="https://cushpayments.co.uk"><img src="https://img.shields.io/badge/Status-Beta-orange?style=for-the-badge" alt="Status"></a>
  <a href="https://www.linkedin.com/in/matthew-folson-8632b51"><img src="https://img.shields.io/badge/Founder-Matthew%20Ekow%20Folson-0A66C2?style=for-the-badge&logo=linkedin" alt="Founder"></a>
</p>

---

## Overview

Cush Payments delivers a premium remittance experience purpose-built for the African diaspora. Send money to mobile wallets and bank accounts across Africa in seconds, with fully transparent pricing (1.8% standard fee) and regulated settlement.

This repository contains the **consumer remittance app** — a native iPhone and Android experience (Human Interface Guidelines + Material 3) you can install to the home screen today. Cush Core platform source remains private during the current funding and licensing phase.

---

## Consumer app

One product, two native shells. Switch **iPhone** / **Pixel** in the preview.

| Practice | In the app |
|----------|------------|
| **KYC before first send** | Legal name, date of birth, residency, occupation, source of funds |
| **App lock** | Face ID (iPhone), fingerprint (Pixel), or 4-digit passcode |
| **They receive first** | Type cedis, naira, shillings — Cush reverse-quotes what you pay |
| **Rate lock** | Mid-market FX held for 30 seconds on review |
| **Name enquiry** | Wallet / bank name check before you confirm |
| **SCA** | Biometric or passcode on every send (PSD2-style step-up) |
| **Limits** | Daily / monthly / single-send caps with remaining balance |
| **Activity** | Rail timeline: Faster Payments → Cush → PAPSS → MoMo / bank |
| **Pulse** | Corridor trends and a plain-English send-now / wait read |
| **Ask Cush** | Natural language: “send 2,000 cedis to Ama for rent” |

Quotes and FX are illustrative. Transfers persist locally in the browser for the demo. Native App Store / Play binaries ship later with live rails and store review.

### Stack

React 19 · TanStack Start / Router · Tailwind v4 · Zustand · Zod · Recharts

### Run locally

Requires **Node.js 22**.

```bash
git clone https://github.com/MEFolson/cush-payments.git
cd cush-payments
npm install
npm run dev
```

Then open [http://localhost:8080](http://localhost:8080).

```bash
npm run build       # production build
npm run typecheck   # TypeScript
npm test            # unit tests
```

Ask Cush uses xAI when `XAI_API_KEY` is set in the environment. Without it, the rest of the app still runs.

Demo passcode: `2580`.

---

## Key capabilities

| Capability | Description |
|------------|-------------|
| **Instant Settlement** | Target delivery in seconds via modern rails + PAPSS local-currency settlement |
| **Transparent Pricing** | No hidden FX mark-ups; recipient amount shown before confirmation |
| **Agentic AI** | Intelligent routing, fraud detection, compliance orchestration and customer experience |
| **Immutable Ledger** | BLAKE3-based cryptographic ledger for auditability and regulatory confidence |
| **Compliance-first** | Designed for KYC/AML, transaction monitoring, PSD2/DORA-aligned controls and Bank of Ghana / multi-jurisdiction licensing |
| **Africa-first Coverage** | Live payouts across all 54 African countries |
| **Low Operating Cost** | Platform engineered for ~$1 per customer per month opex at scale |

---

## Architecture highlights (Cush Core)

- **Immutable Ledger Layer** – Cryptographically verifiable transaction history using BLAKE3
- **Agentic AI Orchestration** – Autonomous agents for payment routing, risk scoring, reconciliation and customer support
- **Multi-rail Connectivity** – Integration with traditional rails (SWIFT, Faster Payments, SEPA, FEDWIRE) and African systems (PAPSS, GHIPSS, local mobile money)
- **Embedded Finance APIs** – BaaS-style interfaces for partners to embed payments and accounts
- **Regulatory Sandbox Ready** – Architecture supports Bank of Ghana and other central-bank sandbox engagement
- **Multi-entity Structure** – Designed for UK Ltd (FCA), Ghana Ltd (BoG PSP), US subsidiary and optional Mauritius holding for tax efficiency

---

## Leadership

**Matthew Ekow Folson** – Founder & CEO  
25+ years technology leadership in banking, payments and fintech. Former Open-Source Consultant & PM (IDAM/Cyber) at HSBC (FOSS Board Chair), IT Portfolio Manager at Metro Bank (PSD2), Head of Release & PM at Orwell Group. Led the first non-bank PSP as Direct CHAPS member at the Bank of England.  
[LinkedIn](https://www.linkedin.com/in/matthew-folson-8632b51) · [GitHub](https://github.com/MEFolson)

**Jose Luis Caldeira** – CTO  
20+ years in banking technology, digital architecture, big data, stablecoins and distributed financial systems.  
[LinkedIn](https://www.linkedin.com/in/luiscaldeira/)

Combined team experience exceeds 75 years in regulated payments and core systems.

---

## Planned public assets

- API reference documentation
- Client SDKs (selected languages)
- Architecture decision records (ADRs)
- Compliance and security whitepapers (public summaries)
- Sample integrations and sandbox tooling

---

## Links

- **Website / Beta Waitlist**: [cushpayments.co.uk](https://cushpayments.co.uk)
- **Investor Data Room** (authorised access): available on request
- **Company**: Cush Payments
- **Contact**: mfolson@cushpayments.com

---

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).

---

## Security & responsible disclosure

Security is foundational. Please report any suspected vulnerabilities privately to the founders. Public disclosure of zero-days is not requested or expected.

---

<p align="center">
  <em>Built for the African diaspora. Engineered for regulated scale.</em><br>
  © 2025–2026 Cush Payments. All rights reserved.
</p>
