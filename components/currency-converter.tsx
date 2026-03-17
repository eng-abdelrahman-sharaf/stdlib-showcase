"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftRight, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { currencies, Currency } from "@/lib/types";

function CurrencySelector({
  paramName,
  passedCurrency,
}: {
  paramName: "from" | "to";
  passedCurrency: Currency;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<Currency>(passedCurrency);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    setValue(passedCurrency);
  }, [passedCurrency]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-busy={isPending}
          className="h-12 w-65 justify-between px-4 text-base"
        >
          {value}
          <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-65 p-0">
        <Command>
          <CommandInput
            className="h-12 text-base"
            placeholder="Search currency..."
          />
          <CommandList>
            <CommandEmpty className="py-4 text-base">
              No currency found.
            </CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  className="py-3 text-base"
                  key={currency}
                  value={currency}
                  onSelect={(currentValue: Currency) => {
                    setValue(currentValue);
                    setOpen(false);

                    const params = new URLSearchParams(searchParams.toString());
                    params.set(paramName, currentValue);
                    startTransition(() => {
                      router.push(`${pathname}?${params.toString()}`);
                    });
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-5 w-5",
                      value === currency ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {currency}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function CurrencyConverter({
  from,
  to,
}: {
  from: Currency;
  to: Currency;
}) {
  const [fromCurrency, setFromCurrency] = React.useState<Currency>(from);
  const [toCurrency, setToCurrency] = React.useState<Currency>(to);

  React.useEffect(() => {
    setFromCurrency(from);
    setToCurrency(to);
  }, [from, to]);
  const [isPending, startTransition] = React.useTransition();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSwap = () => {
    // update local state immediately for better experience
    setFromCurrency(to);
    setToCurrency(from);

    const params = new URLSearchParams(searchParams.toString());
    params.set("from", to);
    params.set("to", from);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex w-full justify-center flex-wrap items-stretch gap-5">
      <CurrencySelector
        paramName="from"
        passedCurrency={fromCurrency}
      />
      <Button
        type="button"
        size="icon"
        className="h-12 w-12 rounded-full bg-amber-500"
        aria-label="swap currencies"
        aria-busy={isPending}
        onClick={handleSwap}
      >
        <ArrowLeftRight className="size-5 opacity-100 text-white" />
      </Button>
      <CurrencySelector paramName="to" passedCurrency={toCurrency} />
    </div>
  );
}
