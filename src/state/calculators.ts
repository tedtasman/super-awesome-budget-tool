import type { Expense } from "./interface/expense";
import type { Income } from "./interface/income";
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
export function getYearlyValue(expense: Expense, incomes: Record<string, Income>): number {
  switch (expense.amount.kind) {
    case "flat":
      return expense.amount.periodicCost * (365 / expense.amount.periodicDays);
    case "paycheckPercentage":
      return incomes[expense.amount.incomeId].value * expense.amount.percentage;
    default:
      throw new Error(`Unknown expense amount kind: ${(expense.amount as any).kind}`);
  }
}
