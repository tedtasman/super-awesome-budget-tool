import type { Expense } from "./interface/expense";
import type { Income, IncomeStream } from "./interface/income";
import type { TaxBracket } from "./interface/taxBracket";

/* Helper calculator functions for financial calculations. Called in selectors */

/**
 *
 * @param income
 * @param brackets
 * @returns tax owed (NOT post-tax income)
 */
export function applyTaxBracket(income: number, brackets: TaxBracket[]): number {
  // Sort brackets by lowerBound to ensure correct calculation
  const sorted = [...brackets].sort((a, b) => a.lowerBound - b.lowerBound);

  return sorted.reduce((total, bracket, i) => {
    // income doesn't reach this bracket at all
    if (income <= bracket.lowerBound) return total;
    // upper bound is the next bracket's lower bound, or Infinity if this is the last bracket
    const upperBound = sorted[i + 1]?.lowerBound ?? Infinity;
    // tax only the portion of income that falls within this bracket
    const taxableInBracket = Math.min(income, upperBound) - bracket.lowerBound;
    // apply bracket rate to the taxable portion and add to total
    return total + taxableInBracket * bracket.rate;
  }, 0);
}

/**
 * Gets the yearly value of an expense based on its type and associated incomes.
 * @param expense
 * @param incomes
 * @returns The yearly value of the expense.
 */
export function getYearlyExpenseValue(expense: Expense, incomes: Record<string, Income>): number {
  switch (expense.amount.kind) {
    case "flat":
      return expense.amount.periodicCost * (365 / expense.amount.periodicDays);
    case "paycheckPercentage":
      return getYearlyIncomeValue(incomes[expense.amount.incomeId]) * expense.amount.percentage;
    default:
      throw new Error(`Unknown expense amount kind: ${JSON.stringify(expense.amount)}`);
  }
}

export function getYearlyStreamValue(stream: IncomeStream, payPeriodDays: number): number {
  switch (stream.kind) {
    case "hourly":
      switch (stream.streamCadence.kind) {
        case "everyPaycheck":
          return stream.hourlyRate * stream.hoursPerPeriod * Math.floor(365 / payPeriodDays);
        case "everyNDays":
          return stream.hourlyRate * stream.hoursPerPeriod * (365 / stream.streamCadence.n);
        default:
          throw new Error(`Unknown stream cadence kind: ${JSON.stringify(stream.streamCadence)}`);
      }
    case "salary":
      return stream.annualValue;
    default:
      throw new Error(`Unknown income stream kind: ${JSON.stringify(stream)}`);
  }
}

export function getYearlyIncomeValue(income: Income): number {
  return Object.values(income.streams).reduce((total, stream) => {
    return total + getYearlyStreamValue(stream, income.payPeriodDays);
  }, 0);
}
