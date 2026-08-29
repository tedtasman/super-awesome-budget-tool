export type ExpenseAmount =
  | { kind: "flat"; yearlyValue: number; frequencyDays: number }
  | { kind: "paycheckPercentage"; incomeId: string; percentage: number };

export interface Expense {
  id: string;
  name: string;
  taxRouteIds: string[];
  amount: ExpenseAmount;
}
