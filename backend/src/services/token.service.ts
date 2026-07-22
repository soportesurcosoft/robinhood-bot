export class InvalidTokenAddressError extends Error {
  constructor() {
    super("Enter a valid Robinhood Chain token contract address.");
    this.name = "InvalidTokenAddressError";
  }
}

const EVM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

function hashAddress(address: string): number {
  return [...address.toLowerCase()].reduce(
    (hash, character) => ((hash << 5) - hash + character.charCodeAt(0)) | 0,
    0,
  ) >>> 0;
}

function round(value: number, digits = 2): number {
  return Number(value.toFixed(digits));
}

export async function getToken(contract: string) {
  if (!EVM_ADDRESS.test(contract)) {
    throw new InvalidTokenAddressError();
  }

  const normalizedContract = contract.toLowerCase();
  const seed = hashAddress(normalizedContract);
  const suffix = (seed % 10_000).toString().padStart(4, "0");
  const priceUsd = round(0.0001 + (seed % 25_000) / 10_000_000, 8);
  const priceChange24h = round(((seed % 4_001) - 2_000) / 100, 2);
  const liquidityUsd = round(25_000 + (seed % 2_000_000), 2);
  const volume24hUsd = round(10_000 + ((seed >>> 5) % 1_500_000), 2);
  const riskScore = 25 + (seed % 66);
  const now = Date.now();

  const chart = Array.from({ length: 24 }, (_, index) => {
    const pointSeed = (seed + index * 101) % 100;
    const drift = (index - 23) * (priceChange24h / 2_400);
    const noise = (pointSeed - 50) / 1_000;
    const value = Math.max(priceUsd * (1 + drift / 100 + noise / 100), 0.00000001);

    return {
      time: new Date(now - (23 - index) * 60 * 60 * 1_000).toISOString(),
      value: round(value, 8),
    };
  });

  return {
    mode: "paper",
    token: {
      contractAddress: normalizedContract,
      name: `Simulated Token ${suffix}`,
      symbol: `SIM${suffix}`,
      decimals: 18,
    },
    market: {
      priceUsd,
      priceChange24h,
      liquidityUsd,
      volume24hUsd,
      marketCapUsd: round(liquidityUsd * (4 + (seed % 20)), 2),
    },
    risk: {
      score: riskScore,
      level: riskScore >= 70 ? "high" : riskScore >= 45 ? "medium" : "low",
      flags: [
        "Paper-mode data only",
        riskScore >= 70 ? "High volatility simulation" : "No critical simulated alerts",
      ],
    },
    chart,
    updatedAt: new Date().toISOString(),
  };
}