import { useStore } from "./store";
import { select } from "./select";

/* Hooks for concise access to the financial store and selectors. */
/* Names sorted alphabetically to please my brain */

/* ======================== Data Hooks ======================== */
/* ----- Store ----- */
export const useExpenses = () => useStore((s) => s.expenses);
export const useIncomes = () => useStore((s) => s.incomes);
export const useTaxRoutes = () => useStore((s) => s.taxRoutes);
/*  ----- End store ----- */

/* ----- Select ----- */
export const useExpensesForRoute = (routeId: string) => useStore(select.expensesForRoute(routeId));
export const useExpenseValueIfTaxed = (expenseId: string) => useStore(select.expenseValueIfTaxed(expenseId));
export const useIncomesForRoute = (routeId: string) => useStore(select.incomesForRoute(routeId));
export const usePostTaxIncome = () => useStore(select.postTaxIncome);
export const useTaxOwedForRoute = (routeId: string) => useStore(select.taxOwedForRoute(routeId));
export const useTaxOwedForRouteWithoutExpenses = (routeId: string, expenseIds: string[]) =>
  useStore(select.taxOwedForRouteWithoutExpenses(routeId, expenseIds));

export const useTotalIncomePreTax = () => useStore(select.totalIncomePreTax);
export const useTotalTaxOwed = () => useStore(select.totalTaxOwed);
export const useTotalTaxOwedWithoutExpenses = (expenseIds: string[]) =>
  useStore(select.totalTaxOwedWithoutExpenses(expenseIds));
/* ---- End select ----- */
/* ======================== End Data Hooks ======================== */

/* ======================== Action Hooks ======================== */
/* ----- Store ----- */
export const useRemoveIncome = () => useStore((s) => s.removeIncome);
export const useRemoveExpense = () => useStore((s) => s.removeExpense);
export const useRemoveTaxRoute = () => useStore((s) => s.removeTaxRoute);
export const useSetExpense = () => useStore((s) => s.setExpense);
export const useSetIncome = () => useStore((s) => s.setIncome);
export const useSetTaxRoute = () => useStore((s) => s.setTaxRoute);
/* ----- End store ----- */
/* ======================== End Action Hooks ======================== */
