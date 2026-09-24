export type ExpenseAmount = { kind: "flat"; cost: number } | { kind: "percentage"; decimalValue: number };

interface ExpenseBase {
  id: string;
  name: string;
  reducedTaxRouteIds: Set<string>;
  categoryId: string;
}

interface RecurringExpense extends ExpenseBase {
  type: "recurring";
  cadence: number; // in days
  cost: number; // cost per cadence
}

interface IncomeTiedExpense extends ExpenseBase {
  type: "tiedToIncome";
  incomeId: string;
  amount: ExpenseAmount;
}

export type Expense = RecurringExpense | IncomeTiedExpense;
