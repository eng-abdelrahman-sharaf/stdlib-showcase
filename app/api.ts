import { Currency, HistoricalData } from "@/lib/types";

export const getHistoricalRates = async (
  fromCurrency: Currency,
  toCurrency: Currency,
  fromDate: Date,
  toDate: Date = new Date(),
) => {
  const fromDateString = fromDate.toISOString().split("T")[0];
  const toDateString = toDate.toISOString().split("T")[0];
  
  // handle the case where both currencies are the same
  if (fromCurrency === toCurrency) {
    return {
      rates: Array.from({ length: 365 }, (_, idx) => {
        const date = new Date(fromDate);
        date.setDate(date.getDate() + idx);
        return {
          date: date.toISOString().split("T")[0],
          rate: 1,
        };
      }),
    };
  }

  const res = await fetch(
    `https://api.frankfurter.dev/v1/${fromDateString}..${toDateString}?base=${fromCurrency}`,
  );

  const data = await res.json();

  if (!res.ok) {
    return { error: data.message || "Failed to fetch historical rates" };
  }
  if (!data.rates) {
    return { error: "No rates data found" };
  }

  return {
    rates: Object.entries(data.rates).map(([date, rate]) => ({
      date,
      rate: rate[toCurrency],
    })) as HistoricalData,
  };
};