import { useDataStore } from "./dataStore";
import { dataSelect } from "./dataSelect";

/* Hooks for concise access to the financial store and selectors. */
/* Names sorted alphabetically to please my brain */

/* ======================== Data Hooks ======================== */
/* ----- Store ----- */
export const useExpenses = () => useDataStore((s) => s.expenses);
export const useIncomes = () => useDataStore((s) => s.incomes);
export const useTaxRoutes = () => useDataStore((s) => s.taxRoutes);
/*  ----- End store ----- */

/* ----- Select ----- */
export const useExpensesForRoute = (routeId: string) => useDataStore(dataSelect.expensesForRoute(routeId));
export const useExpenseValueIfTaxed = (expenseId: string) => useDataStore(dataSelect.expenseValueIfTaxed(expenseId));
export const useIncomesForRoute = (routeId: string) => useDataStore(dataSelect.incomesForRoute(routeId));
export const usePostTaxIncome = () => useDataStore(dataSelect.postTaxIncome);
export const useTaxOwedForRoute = (routeId: string) => useDataStore(dataSelect.taxOwedForRoute(routeId));
export const useTaxOwedForRouteWithoutExpenses = (routeId: string, expenseIds: string[]) =>
  useDataStore(dataSelect.taxOwedForRouteWithoutExpenses(routeId, expenseIds));

export const useTotalIncomePreTax = () => useDataStore(dataSelect.totalIncomePreTax);
export const useTotalTaxOwed = () => useDataStore(dataSelect.totalTaxOwed);
export const useTotalTaxOwedWithoutExpenses = (expenseIds: string[]) =>
  useDataStore(dataSelect.totalTaxOwedWithoutExpenses(expenseIds));
/* ---- End select ----- */
/* ======================== End Data Hooks ======================== */

/* ======================== Data Action Hooks ======================== */
/* ----- Store ----- */
export const useRemoveIncome = () => useDataStore((s) => s.removeIncome);
export const useRemoveExpense = () => useDataStore((s) => s.removeExpense);
export const useRemoveTaxRoute = () => useDataStore((s) => s.removeTaxRoute);
export const useSetExpense = () => useDataStore((s) => s.setExpense);
export const useSetIncome = () => useDataStore((s) => s.setIncome);
export const useSetIncomeStream = () => useDataStore((s) => s.setIncomeStream);
export const useSetTaxRoute = () => useDataStore((s) => s.setTaxRoute);
/* ----- End store ----- */
/* ======================== End Data Action Hooks ======================== */
