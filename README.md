<p align="center">
  <img src="assets/logo.svg" alt="Cush Payments Logo" width="120" height="120">
</p>

<h1 align="center">Cush Payments</h1>

<p align="center">
  <strong>AI native African payments and remittances platform</strong><br>
  Set to become the de facto Africa payments platform, moving money from the African diaspora to Africa, running on Cush Core
</p>

<p align="center">
  <a href="https://cushpayments.com"><img src="https://img.shields.io/badge/Website-cushpayments.com-black?style=for-the-badge" alt="Website"></a>
  <a href="https://cush-core.com"><img src="https://img.shields.io/badge/Core-cush--core.com-black?style=for-the-badge" alt="Cush Core"></a>
  <a href="https://www.linkedin.com/in/matthew-folson-8632b51"><img src="https://img.shields.io/badge/Founder-Matthew%20Ekow%20Folson-0A66C2?style=for-the-badge&logo=linkedin" alt="Founder"></a>
</p>

## Overview

Cush Payments is set to become the de facto Africa payments platform, moving money from the African diaspora, wherever they live, to families and businesses across Africa. Send money to mobile wallets and bank accounts with transparent pricing (1.8% standard fee) where you see what the recipient gets before you send.

Cush Payments is pre launch, with closed beta planned for January to March 2027 and production launch planned for Q2 2027. Cush Payments is not yet live, regulated, or licensed; regulatory preparation is a design claim rather than a licence already granted.

This repository contains the consumer remittance application preview (iPhone and Android web experience). Cush Core (`cush-core.com`), our AI native, licensable core banking platform for global banks, Tier 1 banks, and central banks, remains in a separate repository.

## Consumer app preview

One product, two native shells. Switch **iPhone** or **Pixel** in the preview.

| Practice | In the app |
|----------|------------|
| **KYC before first send** | Legal name, date of birth, residency, occupation, source of funds |
| **App lock** | Face ID (iPhone), fingerprint (Pixel), or 4 digit passcode |
| **They receive first** | Type cedis, naira, shillings and Cush quotes what you pay |
| **Rate lock** | Mid market FX held for 30 seconds on review |
| **Name enquiry** | Wallet or bank name check before you confirm |
| **SCA** | Biometric or passcode on every send (PSD2 style step up) |
| **Limits** | Daily, monthly, and single send caps with remaining balance |
| **Activity** | Rail timeline across Faster Payments, Cush, PAPSS, and mobile money or bank |
| **Pulse** | Corridor trends and a plain English send now or wait read |
| **Ask Cush** | Natural language prompt such as "send 2,000 cedis to Ama for rent" |

Quotes and FX are illustrative. Transfers persist locally in the browser for the demo.

### Stack

React 19, TanStack Start and Router, Tailwind v4, Zustand, Zod, Recharts

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

## Key design capabilities

| Capability | Description |
|------------|-------------|
| **Instant Settlement Design** | Target delivery in seconds via modern rails and PAPSS local currency settlement |
| **Transparent Pricing** | No hidden FX markups; recipient amount shown before confirmation |
| **Agentic AI** | Intelligent routing, fraud detection, compliance orchestration, and customer experience |
| **Immutable Ledger** | BLAKE3 cryptographic ledger for auditability and supervisory review |
| **Compliance by Design** | Architecture prepared for KYC, AML, transaction monitoring, PSD2 and DORA aligned controls, and multi jurisdiction licensing (prepared, not yet granted) |
| **Pan African Roadmap** | Designed for diaspora corridors into African mobile wallets and bank accounts |
| **Low Operating Cost** | Platform engineered for low unit operating cost at scale |

## Architecture highlights (Cush Core)

* **Immutable Ledger Layer:** Cryptographically verifiable transaction history using BLAKE3
* **Agentic AI Orchestration:** Autonomous agents for payment routing, risk scoring, reconciliation, and customer support under institutional mandate
* **Multi Rail Connectivity:** Designed for integration with traditional rails (SWIFT, Faster Payments, SEPA, Fedwire, CHAPS) and African systems (PAPSS, GhIPSS, local mobile money)
* **Embedded Finance APIs:** Interfaces for partner institutions to run accounts, cards, loans, and payments in their own brand
* **Supervisory Readiness:** Architecture prepared for PRA, MAS, Bank of Ghana, and peer sandbox programmes (preparation is a design claim, not a granted licence)

## Leadership

**Matthew Ekow Folson**, Founder and Group CEO  
25+ years technology leadership in banking, payments, and fintech. Led the first non bank PSP onboarded by the Bank of England as a Direct CHAPS member, chaired EFOSS at HSBC, served as IT Portfolio Manager at Metro Bank (PSD2), and Head of Release and PM at Orwell Group.  
[LinkedIn](https://www.linkedin.com/in/matthew-folson-8632b51) · [GitHub](https://github.com/MEFolson)

**Jose Luis Caldeira**, Chief Technology Officer  
20+ years in banking technology, digital architecture, big data, stablecoins, and distributed financial systems.  
[LinkedIn](https://www.linkedin.com/in/luiscaldeira/)

## Links

* **Cush Payments**: [cushpayments.com](https://cushpayments.com) and [cushpayments.co.uk](https://cushpayments.co.uk)
* **Cush Core**: [cush-core.com](https://cush-core.com)
* **Investor Data Room** (authorised access): available on request
* **Contact**: mfolson@cushpayments.com

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).

## Security and responsible disclosure

Security is foundational. Please report any suspected vulnerabilities privately to the team at mfolson@cushpayments.com.

<p align="center">
  <em>Built for the African diaspora.</em><br>
  © 2025 to 2026 Cush Payments. All rights reserved.
</p>
