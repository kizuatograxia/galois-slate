import { useQuery } from "@tanstack/react-query";

export interface ExchangeRatesResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

const fetchRates = async (base: string): Promise<ExchangeRatesResponse> => {
  const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
  if (!res.ok) throw new Error(`Falha ao buscar câmbio (${res.status})`);
  return res.json();
};

export const useCurrencyRates = (base: string) => {
  return useQuery({
    queryKey: ["currency-rates", base],
    queryFn: () => fetchRates(base),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export interface FiatCurrency {
  code: string;
  name: string;
  flag: string;
}

export const FIAT_CURRENCIES: FiatCurrency[] = [
  { code: "USD", name: "Dólar Americano", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "BRL", name: "Real Brasileiro", flag: "🇧🇷" },
  { code: "GBP", name: "Libra Esterlina", flag: "🇬🇧" },
  { code: "JPY", name: "Iene Japonês", flag: "🇯🇵" },
  { code: "CHF", name: "Franco Suíço", flag: "🇨🇭" },
  { code: "CAD", name: "Dólar Canadense", flag: "🇨🇦" },
  { code: "AUD", name: "Dólar Australiano", flag: "🇦🇺" },
  { code: "CNY", name: "Yuan Chinês", flag: "🇨🇳" },
  { code: "ARS", name: "Peso Argentino", flag: "🇦🇷" },
  { code: "MXN", name: "Peso Mexicano", flag: "🇲🇽" },
  { code: "CLP", name: "Peso Chileno", flag: "🇨🇱" },
  { code: "COP", name: "Peso Colombiano", flag: "🇨🇴" },
  { code: "PEN", name: "Sol Peruano", flag: "🇵🇪" },
  { code: "INR", name: "Rúpia Indiana", flag: "🇮🇳" },
  { code: "KRW", name: "Won Sul-Coreano", flag: "🇰🇷" },
  { code: "SGD", name: "Dólar de Singapura", flag: "🇸🇬" },
  { code: "HKD", name: "Dólar de Hong Kong", flag: "🇭🇰" },
  { code: "NOK", name: "Coroa Norueguesa", flag: "🇳🇴" },
  { code: "SEK", name: "Coroa Sueca", flag: "🇸🇪" },
  { code: "DKK", name: "Coroa Dinamarquesa", flag: "🇩🇰" },
  { code: "PLN", name: "Zloty Polonês", flag: "🇵🇱" },
  { code: "CZK", name: "Coroa Tcheca", flag: "🇨🇿" },
  { code: "TRY", name: "Lira Turca", flag: "🇹🇷" },
  { code: "ZAR", name: "Rand Sul-Africano", flag: "🇿🇦" },
  { code: "NGN", name: "Naira Nigeriano", flag: "🇳🇬" },
  { code: "EGP", name: "Libra Egípcia", flag: "🇪🇬" },
];
