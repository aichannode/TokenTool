# TokenTool

**Live site:** [https://www.tokentool.io/](https://www.tokentool.io/)

TokenTool is a web app for creating and deploying **ERC-20** tokens on EVM networks and **SPL** tokens on **Solana**, plus a **Raydium liquidity manager** for Solana. The marketing home page describes it as a way to launch a crypto or meme token in about a minute by choosing a token type and chain.

## Features

- **EVM standard token** — Deploy ERC-20 contracts with typical options (supply, ownership, mint, burn, pause) via wallet-connected flows. Supported chains include Ethereum, BNB Smart Chain, Polygon, Base, OP Mainnet, Arbitrum One, Avalanche, and Blast.
- **Solana SPL token** — Create SPL tokens with metadata (name, symbol, decimals, logo) using Solana wallets and Metaplex-related tooling.
- **Raydium liquidity manager** — Manage liquidity on Raydium from the app (see `/liquidity-manager`).
- **Pricing** — Per-chain pricing is shown on the site (`/pricing`); implementation lives in `src/global/config/index.ts`.

Other routes include **Contact Us** and legal pages (**Privacy Policy**, **Terms & Conditions**).

## Tech stack

- **Framework:** [Next.js](https://nextjs.org/) 14 (App Router), React 18, TypeScript
- **EVM:** [wagmi](https://wagmi.sh/), [viem](https://viem.sh/), [RainbowKit](https://www.rainbowkit.com/), [Thirdweb React](https://thirdweb.com/)
- **Solana:** [@solana/web3.js](https://solana.com/docs), [@solana/spl-token](https://spl.solana.com/token), [Anchor](https://www.anchor-lang.com/), wallet adapter UI, Metaplex token metadata
- **UI:** Tailwind CSS, Material Tailwind, Heroicons
- **Email:** Contact form can use SendGrid via `src/app/api/send-email/route.ts` (configure API keys in your environment for production)

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build    # production build
npm run start    # run production server
npm run lint     # ESLint
```

## Project layout

- `src/app/` — Pages (home, `standard-token`, `spl-token`, `liquidity-manager`, `pricing`, contact, legal)
- `src/components/` — Shared UI (header, footer, token panels, wallet controls)
- `src/global/` — Chain config, ABIs, IDLs, services, and utilities

---

This repository powers **[tokentool.io](https://www.tokentool.io/)**. For framework-specific Next.js docs, see [Next.js Documentation](https://nextjs.org/docs).
