import type { Expense } from "./interface/expense";
import type { Income, IncomeStream } from "./interface/income";
import type { TaxRoute } from "./interface/taxRoute";
import { create } from "zustand";

/* Zustand store for managing financial data: incomes, expenses, and tax routes. */
/* Names sorted alphabetically to please my brain */

export interface DataStore {
  expenses: Record<string, Expense>;
  incomes: Record<string, Income>;
  taxRoutes: Record<string, TaxRoute>;

  removeExpense: (expenseId: string) => void;
  removeIncome: (incomeId: string) => void;
  removeTaxRoute: (taxRouteId: string) => void;

  setExpense: (expense: Expense) => void;
  setIncome: (income: Income) => void;
  setIncomeStream: (incomeId: string, stream: IncomeStream) => void;
  setTaxRoute: (taxRoute: TaxRoute) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  expenses: {},
  incomes: {},
  taxRoutes: {},

  setIncomeStream: (incomeId: string, stream: IncomeStream) =>
    set((s) => {
      const income = s.incomes[incomeId];
      return {
        incomes: {
          ...s.incomes,
          [incomeId]: { ...income, streams: { ...income.streams, [stream.id]: stream } },
        },
      };
    }),

  removeExpense: (id) =>
    set((s) => {
      const { [id]: _, ...rest } = s.expenses;
      return { expenses: rest };
    }),

  removeIncome: (id) =>
    set((s) => {
      const { [id]: _, ...rest } = s.incomes;
      return { incomes: rest };
    }),

  removeTaxRoute: (id) =>
    set((s) => {
      const { [id]: _, ...rest } = s.taxRoutes;
      return { taxRoutes: rest };
    }),

  setExpense: (expense) => set((s) => ({ expenses: { ...s.expenses, [expense.id]: expense } })),
  setIncome: (income) => set((s) => ({ incomes: { ...s.incomes, [income.id]: income } })),
  setTaxRoute: (route) => set((s) => ({ taxRoutes: { ...s.taxRoutes, [route.id]: route } })),
}));
