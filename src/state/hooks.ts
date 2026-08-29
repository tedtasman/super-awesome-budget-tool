import { useFinancialStore } from "./store";
import { select } from "./select";

/* Hooks for concise access to the financial store and selectors. */

/* ======================== Data Hooks ======================== */
/* ----- Store ----- */
export const useIncomes = () => useFinancialStore((s) => Object.values(s.incomes));
export const useExpenses = () => useFinancialStore((s) => Object.values(s.expenses));
export const useTaxRoutes = () => useFinancialStore((s) => Object.values(s.taxRoutes));
/*  ----- End store ----- */

/* ----- Select ----- */
export const incomesForRoute = (routeId: string) => useFinancialStore(select.incomesForRoute(routeId));
export const expensesForRoute = (routeId: string) => useFinancialStore(select.expensesForRoute(routeId));
export const taxOwedForRoute = (routeId: string) => useFinancialStore(select.taxOwedForRoute(routeId));
export const postTaxIncome = () => useFinancialStore(select.postTaxIncome);
/* ---- End select ----- */
/* ======================== End Data Hooks ======================== */

/* ======================== Action Hooks ======================== */
/* ----- Store ----- */
export const useSetIncome = () => useFinancialStore((s) => s.setIncome);
export const useRemoveIncome = () => useFinancialStore((s) => s.removeIncome);
export const useSetExpense = () => useFinancialStore((s) => s.setExpense);
export const useRemoveExpense = () => useFinancialStore((s) => s.removeExpense);
export const useSetTaxRoute = () => useFinancialStore((s) => s.setTaxRoute);
export const useRemoveTaxRoute = () => useFinancialStore((s) => s.removeTaxRoute);
/* ----- End store ----- */
/* ======================== End Action Hooks ======================== */
