import type { StoreApi, UseBoundStore } from "zustand";
import type { ExpensesStore } from "../store/expenses";
import { useNecessitiesStore, useMiscStore, useSavingsStore } from "../store/expenses";

function createExpensesHooks(useStore: UseBoundStore<StoreApi<ExpensesStore>>) {
  return {
    useExpenses: () => useStore((state) => state.expenses),
    useSetExpenses: () => useStore((state) => state.setExpenses),
    useAddExpense: () => useStore((state) => state.addExpense),
    useRemoveExpense: () => useStore((state) => state.removeExpense),
    useUpdateExpense: () => useStore((state) => state.updateExpense),
    usePreTaxDeductions: () => useStore((state) => state.preTaxDeductions),
    useSetPreTaxDeductions: () => useStore((state) => state.setPreTaxDeductions),
    useAddPreTaxDeduction: () => useStore((state) => state.addPreTaxDeduction),
    useRemovePreTaxDeduction: () => useStore((state) => state.removePreTaxDeduction),
    useUpdatePreTaxDeduction: () => useStore((state) => state.updatePreTaxDeduction),
    usePostTaxDeductions: () => useStore((state) => state.postTaxDeductions),
    useSetPostTaxDeductions: () => useStore((state) => state.setPostTaxDeductions),
    useAddPostTaxDeduction: () => useStore((state) => state.addPostTaxDeduction),
    useRemovePostTaxDeduction: () => useStore((state) => state.removePostTaxDeduction),
    useUpdatePostTaxDeduction: () => useStore((state) => state.updatePostTaxDeduction),
  };
}

export const necessitiesHooks = createExpensesHooks(useNecessitiesStore);
export const savingsHooks = createExpensesHooks(useSavingsStore);
export const miscHooks = createExpensesHooks(useMiscStore);
