import type { Category } from "./interface/category";
import type { Expense } from "./interface/expense";
import type { Income, IncomeLine } from "./interface/income";
import type { TaxRoute } from "./interface/taxRoute";
import { create } from "zustand";

/* Zustand store for managing financial data: incomes, expenses, and tax routes. */
/* Names sorted alphabetically to please my brain */

export interface DataStore {
  categories: Record<string, Category>;
  expenses: Record<string, Expense>;
  incomes: Record<string, Income>;
  taxRoutes: Record<string, TaxRoute>;

  removeCategory: (categoryId: string) => void;
  removeExpense: (expenseId: string) => void;
  removeIncome: (incomeId: string) => void;
  removeTaxRoute: (taxRouteId: string) => void;

  setCategory: (category: Category) => void;
  setExpense: (expense: Expense) => void;
  setIncome: (income: Income) => void;
  setIncomeLine: (incomeId: string, line: IncomeLine) => void;
  setTaxRoute: (taxRoute: TaxRoute) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  categories: {},
  expenses: {},
  incomes: {},
  taxRoutes: {},

  removeCategory: (id) =>
    set((s) => {
      const { [id]: _, ...rest } = s.categories;
      return { categories: rest };
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

  setCategory: (category) => set((s) => ({ categories: { ...s.categories, [category.id]: category } })),
  setExpense: (expense) => set((s) => ({ expenses: { ...s.expenses, [expense.id]: expense } })),
  setIncome: (income) => set((s) => ({ incomes: { ...s.incomes, [income.id]: income } })),
  setIncomeLine: (incomeId: string, line: IncomeLine) =>
    set((s) => {
      const income = s.incomes[incomeId];
      return {
        incomes: {
          ...s.incomes,
          [incomeId]: { ...income, lines: { ...income.lines, [line.id]: line } },
        },
      };
    }),
  setTaxRoute: (route) => set((s) => ({ taxRoutes: { ...s.taxRoutes, [route.id]: route } })),
}));
