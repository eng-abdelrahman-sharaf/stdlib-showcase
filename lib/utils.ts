import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { max, mean, stdev } from "@stdlib/stats/base";
import { HistoricalData } from "@/app/types";

export const getMeanRate = (data: HistoricalData) => {
  const rates = data.map((d) => d.rate);
  const ratesMean = mean(rates.length, rates, 1);
  return ratesMean;
};

export const getMonthlyAverages = (data: HistoricalData) => {
  const monthlyData: Record<string, number[]> = {};
  data.forEach(({ date, rate }) => {
    const month = date.slice(0, 7); // extract YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = [];
    }
    monthlyData[month].push(rate);
  });

  // convert to array of { month, averageRate }
  return Object.entries(monthlyData).map(([month, rates]) => ({
    month,
    averageRate: mean(rates.length, rates, 1),
  }));
};

export const getMaxRate = (data: HistoricalData) => {
  const rates = data.map((d) => d.rate);
  const maxRate = max(rates.length, rates, 1);
  return maxRate;
};

export const getStandardDeviation = (data: HistoricalData) => {
  const rates = data.map((d) => d.rate);
  return stdev(rates.length, 1, rates, 1);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
