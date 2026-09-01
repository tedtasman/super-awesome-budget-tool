import type { CadenceAdjustment, Income, IncomeStream } from "../interface/income";

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

export function getStreamOccurrences(income: Income, stream: IncomeStream, rangeStart: Date, rangeEnd: Date): Date[] {
  const intervalDays = stream.streamCadence.kind === "everyPaycheck" ? income.payPeriodDays : stream.streamCadence.n;

  const anchor = stream.streamCadence.kind === "everyPaycheck" ? income.anchorDate : stream.streamCadence.anchorDate;

  const rawDates = getOccurrenceDates(anchor, intervalDays, rangeStart, rangeEnd);
  return applyCadenceAdjustments(rawDates, income.cadenceAdjustments);
}

export interface MonthlyStreamTotal {
  monthKey: string; // "2026-11"
  occurrences: Date[];
  total: number;
}

function getStreamOccurrenceValue(stream: IncomeStream, intervalDays: number): number {
  switch (stream.kind) {
    case "hourly":
      return stream.hourlyRate * stream.hoursPerPeriod;
    case "salary":
      return stream.annualValue / (365 / intervalDays);
  }
}

export function getMonthlyStreamTotals(
  income: Income,
  stream: IncomeStream,
  rangeStart: Date,
  rangeEnd: Date,
): MonthlyStreamTotal[] {
  const dates = getStreamOccurrences(income, stream, rangeStart, rangeEnd);
  const intervalDays = stream.streamCadence.kind === "everyPaycheck" ? income.payPeriodDays : stream.streamCadence.n;
  const perOccurrenceValue = getStreamOccurrenceValue(stream, intervalDays);

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
