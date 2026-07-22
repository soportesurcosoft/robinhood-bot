# Robinhood Chain Token Analyzer

The backend is currently in **paper mode**. It does not connect a wallet, submit transactions, or use real market data yet.

## Run locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` if you need to change the port.

## Inspect a simulated token

```text
GET /api/token/0x1111111111111111111111111111111111111111
```

The endpoint requires an EVM-style contract address and returns deterministic simulated token, market, risk, and chart data. The same address always produces the same simulated profile, so the frontend can be built and tested reliably.

A malformed address returns HTTP 400.