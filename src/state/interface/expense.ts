export type ExpenseAmount =
  | { kind: "flat"; periodicCost: number; periodicDays: number }
  | { kind: "paycheckPercentage"; incomeId: string; percentage: number };

export interface Expense {
  id: string;
  name: string;
  taxRouteIds: Set<string>;
  amount: ExpenseAmount;
}
