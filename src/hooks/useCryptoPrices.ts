import { useQuery } from "@tanstack/react-query";

export interface CryptoMeta {
  id: string;
  symbol: string;
  name: string;
  emoji: string;
}

export const CRYPTO_LIST: CryptoMeta[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", emoji: "₿" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", emoji: "Ξ" },
  { id: "solana", symbol: "SOL", name: "Solana", emoji: "◎" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", emoji: "🟡" },
  { id: "ripple", symbol: "XRP", name: "XRP", emoji: "✕" },
  { id: "cardano", symbol: "ADA", name: "Cardano", emoji: "₳" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", emoji: "🔺" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", emoji: "●" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", emoji: "🔗" },
  { id: "matic-network", symbol: "MATIC", name: "Polygon", emoji: "⬢" },
  { id: "the-open-network", symbol: "TON", name: "Toncoin", emoji: "💎" },
];

export interface CryptoPriceEntry {
  price: number;
  change24h?: number;
}

export type CryptoPricesMap = Record<string, CryptoPriceEntry>;

const fetchCryptoPrices = async (currency: string): Promise<CryptoPricesMap> => {
  const ids = CRYPTO_LIST.map((c) => c.id).join(",");
  const cur = currency.toLowerCase();
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${cur}&include_24hr_change=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao buscar cripto (${res.status})`);
  const json: Record<string, Record<string, number>> = await res.json();
  const out: CryptoPricesMap = {};
  for (const [id, entry] of Object.entries(json)) {
    out[id] = {
      price: entry[cur],
      change24h: entry[`${cur}_24h_change`],
    };
  }
  return out;
};

export const useCryptoPrices = (currency: string = "usd") => {
  return useQuery({
    queryKey: ["crypto-prices", currency.toLowerCase()],
    queryFn: () => fetchCryptoPrices(currency),
    staleTime: 25 * 1000,
    refetchInterval: 30 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export interface SparklinePoint {
  t: number;
  v: number;
}

const fetchSparkline = async (id: string): Promise<SparklinePoint[]> => {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao buscar sparkline (${res.status})`);
  const json: { prices: [number, number][] } = await res.json();
  return json.prices.map(([t, v]) => ({ t, v }));
};

export const useCryptoSparkline = (id: string | null) => {
  return useQuery({
    queryKey: ["crypto-sparkline", id],
    queryFn: () => fetchSparkline(id as string),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
