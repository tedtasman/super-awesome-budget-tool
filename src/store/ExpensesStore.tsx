import { create, type StateCreator } from "zustand";

export interface Expense {
  id: string;
  name: string;
  cost: number;
  frequencyDays: number;
}

export interface PaycheckDeduction {
  id: string;
  name: string;
  percentage: number;
  flatAmount: number;
}

interface ExpensesStore {
  // Expenses-related state
  expenses: Record<string, Expense>;
  setExpenses: (expenses: Record<string, Expense>) => void;
  addExpense: (expense: Expense) => void;
  removeExpense: (expenseId: string) => void;
  updateExpense: (expenseId: string, updatedExpense: Partial<Expense>) => void;
  // End expenses-related state
  // Pre-tax deductions-related state
  preTaxDeductions: Record<string, PaycheckDeduction>;
  setPreTaxDeductions: (
    preTaxDeductions: Record<string, PaycheckDeduction>,
  ) => void;
  addPreTaxDeduction: (deduction: PaycheckDeduction) => void;
  removePreTaxDeduction: (deductionId: string) => void;
  updatePreTaxDeduction: (
    deductionId: string,
    updatedDeduction: Partial<PaycheckDeduction>,
  ) => void;
  // Post-tax deductions-related state
  postTaxDeductions: Record<string, PaycheckDeduction>;
  setPostTaxDeductions: (
    postTaxDeductions: Record<string, PaycheckDeduction>,
  ) => void;
  addPostTaxDeduction: (deduction: PaycheckDeduction) => void;
  removePostTaxDeduction: (deductionId: string) => void;
  updatePostTaxDeduction: (
    deductionId: string,
    updatedDeduction: Partial<PaycheckDeduction>,
  ) => void;
  // End post-tax deductions-related state
}

export const createExpensesStore: StateCreator<ExpensesStore> = (set) => ({
  // Begin expenses-related state
  expenses: {},

  setExpenses: (expenses) => set({ expenses }),

  addExpense: (expense) =>
    set((state) => ({
      expenses: { ...state.expenses, [expense.id]: expense },
    })),

  removeExpense: (expenseId) =>
    set((state) => {
      const updatedExpenses = { ...state.expenses };
      delete updatedExpenses[expenseId];
      return { expenses: updatedExpenses };
    }),

  updateExpense: (expenseId, updatedExpense) =>
    set((state) => ({
      expenses: {
        ...state.expenses,
        [expenseId]: {
          ...state.expenses[expenseId],
          ...updatedExpense,
        },
      },
    })),
  // End expenses-related state

  // Begin pre-tax expenses-related state
  preTaxDeductions: {},

  setPreTaxDeductions: (preTaxDeductions) => set({ preTaxDeductions }),

  addPreTaxDeduction: (deduction) =>
    set((state) => ({
      preTaxDeductions: {
        ...state.preTaxDeductions,
        [deduction.id]: deduction,
      },
    })),

  removePreTaxDeduction: (deductionId) =>
    set((state) => {
      const updatedPreTaxDeductions = { ...state.preTaxDeductions };
      delete updatedPreTaxDeductions[deductionId];
      return { preTaxDeductions: updatedPreTaxDeductions };
    }),

  updatePreTaxDeduction: (deductionId, updatedDeduction) =>
    set((state) => ({
      preTaxDeductions: {
        ...state.preTaxDeductions,
        [deductionId]: {
          ...state.preTaxDeductions[deductionId],
          ...updatedDeduction,
        },
      },
    })),
  // End pre-tax expenses-related state

  // Begin post-tax deductions-related state
  postTaxDeductions: {},

  setPostTaxDeductions: (postTaxDeductions) => set({ postTaxDeductions }),

  addPostTaxDeduction: (deduction) =>
    set((state) => ({
      postTaxDeductions: {
        ...state.postTaxDeductions,
        [deduction.id]: deduction,
      },
    })),

  removePostTaxDeduction: (deductionId) =>
    set((state) => {
      const updatedPostTaxDeductions = { ...state.postTaxDeductions };
      delete updatedPostTaxDeductions[deductionId];
      return { postTaxDeductions: updatedPostTaxDeductions };
    }),

  updatePostTaxDeduction: (deductionId, updatedDeduction) =>
    set((state) => ({
      postTaxDeductions: {
        ...state.postTaxDeductions,
        [deductionId]: {
          ...state.postTaxDeductions[deductionId],
          ...updatedDeduction,
        },
      },
    })),
  // End post-tax deductions-related state
});

export const useNecessitiesStore = create(createExpensesStore);
export const useSavingsStore = create(createExpensesStore);
export const useMiscStore = create(createExpensesStore);
