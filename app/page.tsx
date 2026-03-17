import { CurrencyConverter } from "@/components/currency-converter";
import { CurrencyChart } from "../components/currency-chart";
import { getHistoricalRates } from "./api";
import { currencies, Currency } from "@/lib/types";

type HomeProps = {
  searchParams?: Promise<{ from?: string; to?: string }>;
};

function getSearchParamValue(value: any, fallback: Currency): Currency {
  if (value && currencies.includes(value as Currency)) {
    return value;
  }

  return fallback;
}

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;
  console.log("Search params:", searchParams);
  const from = getSearchParamValue(searchParams?.from, "GBP");
  const to = getSearchParamValue(searchParams?.to, "USD");
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const data = await getHistoricalRates(from, to, oneYearAgo);
  return (
    <div className="flex flex-col gap-10 items-center p-10 w-full">
      <CurrencyConverter from={from} to={to} />
      <CurrencyChart fromCurrency={from} toCurrency={to} data={data.rates!} />
    </div>
  );
}
