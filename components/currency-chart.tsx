"use client";

import { ChartArea, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  getMaxRate,
  getMeanRate,
  getMonthlyAverages,
  getStandardDeviation,
} from "@/lib/utils";
import { Currency, HistoricalData } from "@/lib/types";

export function CurrencyChart({
  data,
  fromCurrency,
  toCurrency,
}: {
  data: HistoricalData;
  fromCurrency: Currency;
  toCurrency: Currency;
}) {
  const monthRates = getMonthlyAverages(data);
  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>
          {" "}
          {fromCurrency} to {toCurrency} Chart
        </CardTitle>
        <CardDescription>Showing monthly averages</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="min-h-[500px] max-w-[700px]">
          <AreaChart
            accessibilityLayer
            data={monthRates}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="averageRate"
              type="natural"
              fill="hsl(var(--chart-4))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-4))"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex wrap gap-4">
          <div>Mean: {getMeanRate(data).toFixed(2)}</div>
          <div>Standard Deviation: {getStandardDeviation(data).toFixed(2)}</div>
          <div>Peak: {getMaxRate(data).toFixed(2)}</div>
        </div>
      </CardFooter>
    </Card>
  );
}
