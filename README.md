# Tennis Rally on Arc

Arcade tennis rally game built with Next.js, TailwindCSS, wagmi, and viem for Arc Testnet.

## Highlights

- Fast HTML5 Canvas tennis gameplay with mouse and touch controls
- Simple injected-wallet connection only — no WalletConnect dependency
- Arc Testnet custom chain config via wagmi + viem
- Optional practice mode: users can play before connecting a wallet
- On-chain player profiles and score submission
- USDC approval flow for leaderboard submissions
- Static export ready for Vercel or any static host

## Stack

- Next.js 16 App Router
- React 19
- TailwindCSS 4
- wagmi 2 + viem
- Zustand

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

Static output is generated in `dist/`.

## Arc Testnet

- Chain ID: `5042002`
- RPC: `https://rpc.testnet.arc.network`
- Explorer: `https://testnet.arcscan.app`
- Game contract: `0x492Ee458Ea47Af5360bFEcA2e3ee5767Cce660C7`
