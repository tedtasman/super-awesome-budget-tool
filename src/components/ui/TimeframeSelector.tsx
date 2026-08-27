import { useState } from "react";
import Creatable from "react-select/creatable";
import { useFinancialStore } from "../../state/store/financial";

interface TimeframeOption {
  value: "week" | "month" | "year" | "paycheck" | number;
  label: string;
}

type TimeUnit = "day" | "week" | "month" | "year";

const UNIT_DAYS: Record<TimeUnit, number> = {
  day: 1,
  week: 7,
  month: 30,
  year: 365,
};

function parseCustomInput(input: string): { days: number; label: string } | null {
  const match = input.trim().match(/^(\d+(?:\.\d+)?)\s*(day|days|week|weeks|month|months|year|years)?$/i);
  if (!match) return null;

  const amount = parseFloat(match[1]);
  if (isNaN(amount) || amount <= 0) return null;

  const rawUnit = (match[2] || "day").toLowerCase().replace(/s$/, "") as TimeUnit;
  const days = amount * UNIT_DAYS[rawUnit];
  const label = `${amount} ${rawUnit}${amount === 1 ? "" : "s"}`;

  return { days, label };
}

export default function TimeframeSelector({
  timeframe,
  setTimeFrame,
}: {
  timeframe: "week" | "month" | "year" | "paycheck" | number;
  setTimeFrame: (value: "week" | "month" | "year" | "paycheck" | number) => void;
}) {
  const paychecksPerYear = useFinancialStore((state) => state.paychecksPerYear);
  const [lastCustom, setLastCustom] = useState<{
    value: number;
    label: string;
  } | null>(null);

  const options: TimeframeOption[] = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
    { value: "paycheck", label: "Paycheck" },
  ];

  const formatDaysToReadable = (days: number | string): string => {
    if (typeof days === "string") return days;
    if (days === 7) return "Week";
    if (days === 30) return "Month";
    if (days === 365) return "Year";
    if (Math.abs(days - 365 / paychecksPerYear) < 0.01) return "Paycheck";
    return `${days} days`;
  };

  const presetMatch = options.find((opt) => opt.value === timeframe);
  const currentValue: TimeframeOption =
    presetMatch ||
    (lastCustom && lastCustom.value === timeframe
      ? { value: timeframe, label: lastCustom.label }
      : { value: timeframe, label: formatDaysToReadable(timeframe) });

  const isValidNewOption = (inputValue: string) => parseCustomInput(inputValue) !== null;

  return (
    <Creatable<TimeframeOption>
      value={currentValue}
      onChange={(selectedOption) => {
        if (!selectedOption) return;
        const validPeriods = ["week", "month", "year", "paycheck"];
        if (
          validPeriods.includes(selectedOption.value as string) ||
          (typeof selectedOption.value === "number" && selectedOption.value > 0)
        ) {
          if (typeof selectedOption.value === "string") {
            setLastCustom(null);
          }
          setTimeFrame(selectedOption.value);
        }
      }}
      options={options}
      isValidNewOption={isValidNewOption}
      onCreateOption={(inputValue) => {
        const parsed = parseCustomInput(inputValue);
        if (parsed) {
          setLastCustom({ value: parsed.days, label: parsed.label });
          setTimeFrame(parsed.days);
        }
      }}
    />
  );
}
