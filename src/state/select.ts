import { applyTaxBracket } from "./calculators";
import type { Store } from "./store";

/* Selectors for complex store operations. */

export const select = {
  expensesForRoute: (routeId: string) => (s: Store) =>
    Object.values(s.expenses).filter((expense) => expense.taxRouteIds.includes(routeId)),

  expenseValueIfTaxed: (expenseId: string) => (s: Store) => {
    return (
      select.yearlyValue(expenseId)(s) - (select.totalTaxOwedWithoutExpenses([expenseId])(s) - select.totalTaxOwed(s))
    );
  },

  incomesForRoute: (routeId: string) => (s: Store) =>
    Object.values(s.incomes).filter((income) => income.taxRouteIds.includes(routeId)),

  postTaxIncome: (s: Store) => {
    return select.totalIncomePreTax(s) - select.totalTaxOwed(s);
  },

  taxOwedForRoute: (routeId: string) => (s: Store) => {
    const route = s.taxRoutes[routeId];
    const incomes = select.incomesForRoute(routeId)(s);
    const expenses = select.expensesForRoute(routeId)(s);
    const totalDeductions = expenses.reduce((sum, e) => sum + select.yearlyValue(e.id)(s), 0);
    const totalIncome = incomes.reduce((sum, i) => sum + i.value, 0);
    return applyTaxBracket(totalIncome - totalDeductions, route.brackets);
  },

  taxOwedForRouteWithoutExpenses: (routeId: string, expenseIds: string[]) => (s: Store) => {
    const route = s.taxRoutes[routeId];
    const incomes = select.incomesForRoute(routeId)(s);
    // Filter out the specified expenses
    const expenses = select
      .expensesForRoute(routeId)(s)
      .filter((e) => !expenseIds.includes(e.id));
    const totalDeductions = expenses.reduce((sum, e) => sum + select.yearlyValue(e.id)(s), 0);
    const totalIncome = incomes.reduce((sum, i) => sum + i.value, 0);
    return applyTaxBracket(totalIncome - totalDeductions, route.brackets);
  },

  totalIncomePreTax: (s: Store) => Object.values(s.incomes).reduce((sum, i) => sum + i.value, 0),

  totalTaxOwed: (s: Store) =>
    Object.values(s.taxRoutes).reduce((sum, route) => sum + select.taxOwedForRoute(route.id)(s), 0),

  totalTaxOwedWithoutExpenses: (expenseIds: string[]) => (s: Store) => {
    return Object.values(s.taxRoutes).reduce(
      (sum, route) => sum + select.taxOwedForRouteWithoutExpenses(route.id, expenseIds)(s),
      0,
    );
  },

  yearlyValue: (expenseId: string) => (s: Store) => {
    const expense = s.expenses[expenseId];
    switch (expense.amount.kind) {
      case "flat":
        return expense.amount.yearlyValue;
      case "paycheckPercentage":
        return s.incomes[expense.amount.incomeId].value * expense.amount.percentage;
      default:
        throw new Error(`Unknown expense amount kind: ${(expense.amount as any).kind}`);
    }
  },
};
