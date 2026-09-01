import { getYearlyExpenseValue, getYearlyIncomeValue } from "./calc/amortize";
import { getMonthlyStreamTotals, getStreamOccurrences } from "./calc/occurrences";
import { applyTaxBracket } from "./calc/tax";
import type { DataStore } from "./dataStore";

/* Selectors for complex store operations. */

export const dataSelect = {
  expensesForRoute: (routeId: string) => (s: DataStore) =>
    Object.values(s.expenses).filter((expense) => expense.taxRouteIds.has(routeId)),

  expenseValueIfTaxed: (expenseId: string) => (s: DataStore) => {
    const expense = s.expenses[expenseId];
    return (
      getYearlyExpenseValue(expense, s.incomes) -
      (dataSelect.totalTaxOwedWithoutExpenses([expenseId])(s) - dataSelect.totalTaxOwed(s))
    );
  },

  incomesForRoute: (routeId: string) => (s: DataStore) =>
    Object.values(s.incomes).filter((income) => income.taxRouteIds.has(routeId)),

  monthlyStreamTotals: (incomeId: string, streamId: string, rangeStart: Date, rangeEnd: Date) => (s: DataStore) => {
    const income = s.incomes[incomeId];
    const stream = income.streams[streamId];
    return getMonthlyStreamTotals(income, stream, rangeStart, rangeEnd);
  },

  postTaxIncome: (s: DataStore) => {
    return dataSelect.totalIncomePreTax(s) - dataSelect.totalTaxOwed(s);
  },

  streamOccurrences: (incomeId: string, streamId: string, rangeStart: Date, rangeEnd: Date) => (s: DataStore) => {
    const income = s.incomes[incomeId];
    const stream = income.streams[streamId];
    return getStreamOccurrences(income, stream, rangeStart, rangeEnd);
  },

  taxOwedForRoute: (routeId: string) => (s: DataStore) => {
    const route = s.taxRoutes[routeId];
    const incomes = dataSelect.incomesForRoute(routeId)(s);
    const expenses = dataSelect.expensesForRoute(routeId)(s);
    const totalDeductions = expenses.reduce((sum, e) => sum + getYearlyExpenseValue(e, s.incomes), 0);
    const totalIncome = incomes.reduce((sum, i) => sum + getYearlyIncomeValue(i), 0);
    return applyTaxBracket(totalIncome - totalDeductions, route.brackets);
  },

  taxOwedForRouteWithoutExpenses: (routeId: string, expenseIds: string[]) => (s: DataStore) => {
    const route = s.taxRoutes[routeId];
    const incomes = dataSelect.incomesForRoute(routeId)(s);
    // Filter out the specified expenses
    const expenses = dataSelect
      .expensesForRoute(routeId)(s)
      .filter((e) => !expenseIds.includes(e.id));
    const totalDeductions = expenses.reduce((sum, e) => sum + getYearlyExpenseValue(e, s.incomes), 0);
    const totalIncome = incomes.reduce((sum, i) => sum + getYearlyIncomeValue(i), 0);
    return applyTaxBracket(totalIncome - totalDeductions, route.brackets);
  },

  totalIncomePreTax: (s: DataStore) => Object.values(s.incomes).reduce((sum, i) => sum + getYearlyIncomeValue(i), 0),

  totalTaxOwed: (s: DataStore) =>
    Object.values(s.taxRoutes).reduce((sum, route) => sum + dataSelect.taxOwedForRoute(route.id)(s), 0),

  totalTaxOwedWithoutExpenses: (expenseIds: string[]) => (s: DataStore) => {
    return Object.values(s.taxRoutes).reduce(
      (sum, route) => sum + dataSelect.taxOwedForRouteWithoutExpenses(route.id, expenseIds)(s),
      0,
    );
  },
};
