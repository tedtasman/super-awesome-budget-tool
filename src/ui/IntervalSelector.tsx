import { useState } from "react";
import Creatable from "react-select/creatable";

interface IntervalOption {
  value: "week" | "month" | "year" | number;
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

export default function IntervalSelector({
  interval,
  setInterval,
}: {
  interval: "week" | "month" | "year" | number;
  setInterval: (value: "week" | "month" | "year" | number) => void;
}) {
  const [lastCustom, setLastCustom] = useState<{
    value: number;
    label: string;
  } | null>(null);

  const options: IntervalOption[] = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  const formatDaysToReadable = (days: number | string): string => {
    if (typeof days === "string") return days;
    if (days === 7) return "Week";
    if (days === 30) return "Month";
    if (days === 365) return "Year";
    return `${days} days`;
  };

  const presetMatch = options.find((opt) => opt.value === interval);
  const currentValue: IntervalOption =
    presetMatch ||
    (lastCustom && lastCustom.value === interval
      ? { value: interval, label: lastCustom.label }
      : { value: interval, label: formatDaysToReadable(interval) });

  const isValidNewOption = (inputValue: string) => parseCustomInput(inputValue) !== null;

  return (
    <Creatable<IntervalOption>
      value={currentValue}
      onChange={(selectedOption) => {
        if (!selectedOption) return;
        const validPeriods = ["week", "month", "year"];
        if (
          validPeriods.includes(selectedOption.value as string) ||
          (typeof selectedOption.value === "number" && selectedOption.value > 0)
        ) {
          if (typeof selectedOption.value === "string") {
            setLastCustom(null);
          }
          setInterval(selectedOption.value);
        }
      }}
      options={options}
      isValidNewOption={isValidNewOption}
      onCreateOption={(inputValue) => {
        const parsed = parseCustomInput(inputValue);
        if (parsed) {
          setLastCustom({ value: parsed.days, label: parsed.label });
          setInterval(parsed.days);
        }
      }}
    />
  );
}
