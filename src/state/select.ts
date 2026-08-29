import { applyTaxBracket } from "./calculators";
import type { FinancialStore } from "./store";

/* Selectors for complex store operations. */

export const select = {
  incomesForRoute: (routeId: string) => (s: FinancialStore) =>
    Object.values(s.incomes).filter((income) => income.taxRouteIds.includes(routeId)),

  expensesForRoute: (routeId: string) => (s: FinancialStore) =>
    Object.values(s.expenses).filter((expense) => expense.taxRouteIds.includes(routeId)),

  taxOwedForRoute: (routeId: string) => (s: FinancialStore) => {
    const route = s.taxRoutes[routeId];
    const incomes = select.incomesForRoute(routeId)(s);
    const expenses = select.expensesForRoute(routeId)(s);
    const totalDeductions = expenses.reduce((sum, e) => sum + e.value, 0);
    const totalIncome = incomes.reduce((sum, i) => sum + i.value, 0);
    // calculate the total tax owed for this route
    return applyTaxBracket(totalIncome - totalDeductions, route.brackets); // helper, same as before
  },

  postTaxIncome: (s: FinancialStore) => {
    const totalIncome = Object.values(s.incomes).reduce((sum, i) => sum + i.value, 0);
    const totalTaxOwed = Object.values(s.taxRoutes).reduce(
      (sum, route) => sum + select.taxOwedForRoute(route.id)(s),
      0,
    );
    return totalIncome - totalTaxOwed;
  },
};
