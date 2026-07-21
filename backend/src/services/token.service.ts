export async function getToken(contract: string) {
  return {
    contract,

    name: "Test Token",

    symbol: "TEST",

    price: 1.245,

    marketCap: 2400000,

    liquidity: 530000,

    volume24h: 850000,
  };
}