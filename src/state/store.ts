import type { Expense } from "./interface/expense";
import type { Income } from "./interface/income";
import type { TaxRoute } from "./interface/taxRoute";
import { create } from "zustand";

/* Zustand store for managing financial data: incomes, expenses, and tax routes. */

export interface FinancialStore {
  incomes: Record<string, Income>;
  expenses: Record<string, Expense>;
  taxRoutes: Record<string, TaxRoute>;

  setIncome: (income: Income) => void;
  removeIncome: (incomeId: string) => void;
  setExpense: (expense: Expense) => void;
  removeExpense: (expenseId: string) => void;
  setTaxRoute: (taxRoute: TaxRoute) => void;
  removeTaxRoute: (taxRouteId: string) => void;
}

export const useFinancialStore = create<FinancialStore>((set) => ({
  incomes: {},
  expenses: {},
  taxRoutes: {},
  setIncome: (income) => set((s) => ({ incomes: { ...s.incomes, [income.id]: income } })),
  removeIncome: (id) =>
    set((s) => {
      const { [id]: _, ...rest } = s.incomes;
      return { incomes: rest };
    }),
  setExpense: (expense) => set((s) => ({ expenses: { ...s.expenses, [expense.id]: expense } })),
  removeExpense: (id) =>
    set((s) => {
      const { [id]: _, ...rest } = s.expenses;
      return { expenses: rest };
    }),
  setTaxRoute: (route) => set((s) => ({ taxRoutes: { ...s.taxRoutes, [route.id]: route } })),
  removeTaxRoute: (id) =>
    set((s) => {
      const { [id]: _, ...rest } = s.taxRoutes;
      return { taxRoutes: rest };
    }),
}));
