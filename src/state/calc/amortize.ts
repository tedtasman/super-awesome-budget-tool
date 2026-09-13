import type { Expense } from "../interface/expense";
import type { Income, IncomeLine } from "../interface/income";

/**
 * Gets the yearly value of an expense based on its type and associated incomes.
 * @param expense
 * @param incomes
 * @returns The yearly value of the expense.
 */
export function getYearlyExpenseValue(expense: Expense, incomes: Record<string, Income>): number {
  if (expense.type === "recurring") {
    return getYearlyRecurringExpenseValue(expense);
  }

  if (expense.amount.kind === "flat") {
    return expense.amount.cost * (365 / incomes[expense.incomeId].payPeriodDays);
  } else if (expense.amount.kind === "percentage") {
    return getYearlyIncomeValue(incomes[expense.incomeId]) * expense.amount.decimalValue;
  }

  throw new Error(`Unknown expense type or amount kind for expense with id ${expense.id}.`);
}

export function getYearlyRecurringExpenseValue(expense: Expense): number {
  if (expense.type !== "recurring") {
    throw new Error(`Expense with id ${expense.id} is not a recurring expense.`);
  }
  return expense.cost * (365 / expense.cadence);
}

export function getYearlyLineValue(line: IncomeLine, payPeriodDays: number): number {
  switch (line.kind) {
    case "hourly":
      switch (line.cadence.kind) {
        case "everyPaycheck":
          return line.hourlyRate * line.hoursPerPeriod * Math.floor(365 / payPeriodDays);
        case "everyNDays":
          return line.hourlyRate * line.hoursPerPeriod * (365 / line.cadence.n);
        default:
          throw new Error(`Unknown line cadence kind: ${JSON.stringify(line.cadence)}`);
      }
    case "salary":
      return line.annualValue;
    default:
      throw new Error(`Unknown income line kind: ${JSON.stringify(line)}`);
  }
}

export function getYearlyIncomeValue(income: Income): number {
  return Object.values(income.lines).reduce((total, line) => {
    return total + getYearlyLineValue(line, income.payPeriodDays);
  }, 0);
}
