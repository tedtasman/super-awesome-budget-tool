import type { CadenceAdjustment, Income, IncomeLine } from "../interface/income";

export function getOccurrenceDates(anchorDate: string, intervalDays: number, rangeStart: Date, rangeEnd: Date): Date[] {
  const anchor = new Date(anchorDate);
  const dates: Date[] = [];

  // Jump forward to the first occurrence at or after rangeStart, without looping day-by-day from anchor
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysFromAnchor = Math.floor((rangeStart.getTime() - anchor.getTime()) / msPerDay);
  const intervalsToSkip = Math.max(0, Math.floor(daysFromAnchor / intervalDays));

  let current = new Date(anchor.getTime() + intervalsToSkip * intervalDays * msPerDay);
  while (current < rangeStart) {
    current = new Date(current.getTime() + intervalDays * msPerDay);
  }

  while (current <= rangeEnd) {
    dates.push(new Date(current));
    current = new Date(current.getTime() + intervalDays * msPerDay);
  }

  return dates;
}

export function applyCadenceAdjustments(dates: Date[], adjustments: CadenceAdjustment[]): Date[] {
  const adjustmentMap = new Map(adjustments.map((a) => [a.originalDate, a.adjustedDate]));
  return dates.map((date) => {
    const iso = date.toISOString().split("T")[0];
    const override = adjustmentMap.get(iso);
    return override ? new Date(override) : date;
  });
}

export function getLineOccurrences(income: Income, line: IncomeLine, rangeStart: Date, rangeEnd: Date): Date[] {
  const intervalDays = line.cadence.kind === "everyPaycheck" ? income.payPeriodDays : line.cadence.n;

  const anchor = line.cadence.kind === "everyPaycheck" ? income.anchorDate : line.cadence.anchorDate;

  const rawDates = getOccurrenceDates(anchor, intervalDays, rangeStart, rangeEnd);
  return applyCadenceAdjustments(rawDates, income.cadenceAdjustments);
}

export interface MonthlyLineTotal {
  monthKey: string; // "2026-11"
  occurrences: Date[];
  total: number;
}

function getLineOccurrenceValue(line: IncomeLine, intervalDays: number): number {
  switch (line.kind) {
    case "hourly":
      return line.hourlyRate * line.hoursPerPeriod;
    case "salary":
      return line.annualValue / (365 / intervalDays);
  }
}

export function getMonthlyLineTotals(
  income: Income,
  line: IncomeLine,
  rangeStart: Date,
  rangeEnd: Date,
): MonthlyLineTotal[] {
  const dates = getLineOccurrences(income, line, rangeStart, rangeEnd);
  const intervalDays = line.cadence.kind === "everyPaycheck" ? income.payPeriodDays : line.cadence.n;
  const perOccurrenceValue = getLineOccurrenceValue(line, intervalDays);

  const byMonth = new Map<string, Date[]>();
  for (const date of dates) {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    byMonth.set(key, [...(byMonth.get(key) ?? []), date]);
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, occurrences]) => ({
      monthKey,
      occurrences,
      total: occurrences.length * perOccurrenceValue,
    }));
}
