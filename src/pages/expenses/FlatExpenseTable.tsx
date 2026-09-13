import type { Expense } from "../../state/interface/expense";

import "./ExpenseTable.css";
import { getYearlyRecurringExpenseValue } from "../../state/calc/amortize";

const calculateIntervalCost = (yearlyCost: number, interval: "week" | "month" | "year" | number) => {
  const daysInPeriod = convertIntervalToDays(interval);
  return (yearlyCost / 365) * daysInPeriod;
};

const convertIntervalToDays = (timeframe: "week" | "month" | "year" | number) => {
  if (typeof timeframe === "number") {
    return timeframe;
  }
  return {
    week: 7,
    month: 30,
    year: 365,
  }[timeframe];
};

interface ExpenseRowProps {
  interval: "week" | "month" | "year" | number;
  expense: Expense;
}
export function FlatExpenseRow({ interval, expense }: ExpenseRowProps) {
  if (expense.type !== "recurring") {
    console.warn(`Skipping expense with id ${expense.id} because it is not a recurring expense.`);
    return null; // Only handle recurring expenses
  }
  return (
    <tr key={expense.id} className="expense">
      <td>{expense.name}</td>
      <td>${expense.cost.toFixed(2)}</td>
      <td>{expense.cadence} days</td>
      <td>${calculateIntervalCost(getYearlyRecurringExpenseValue(expense), interval).toFixed(2)}</td>
    </tr>
  );
}

interface ExpenseTableProps {
  interval: "week" | "month" | "year" | number;
  expenses: Record<string, Expense>;
}

export default function FlatExpenseTable({ interval, expenses }: ExpenseTableProps) {
  const totalPeriodicCost = Object.values(expenses).reduce((sum, expense) => {
    if (expense.type === "recurring") {
      return sum + calculateIntervalCost(getYearlyRecurringExpenseValue(expense), interval);
    }
    return sum;
  }, 0);

  return (
    <table className="expense-table">
      <thead className="header">
        <tr>
          <th>Name</th>
          <th>Cost</th>
          <th>Frequency</th>
          <th>Cost per {interval}</th>
        </tr>
      </thead>
      <tbody className="body">
        {Object.values(expenses).map((expense) => (
          <FlatExpenseRow key={expense.id} interval={interval} expense={expense} />
        ))}
        <tr className="total">
          <td>Total</td>
          <td></td>
          <td></td>
          <td>{`$${totalPeriodicCost.toFixed(2)}`}</td>
        </tr>
      </tbody>
    </table>
  );
}
