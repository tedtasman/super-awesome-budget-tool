import { useState } from "react";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { useExpenses, useIncomes, useSetExpense } from "../state/hooks";
import type { Expense } from "../state/interface/expense";
import IntervalSelector from "./IntervalSelector";

import "./styles/ExpenseTable.css";
import { getYearlyValue } from "../state/calculators";

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
  adding: boolean;
  setAdding: (adding: boolean) => void;
}
export function ExpenseRow({ interval, expense, adding, setAdding }: ExpenseRowProps) {
  const incomes = useIncomes();

  if (expense.amount.kind !== "flat") {
    return null; // Only handle flat expenses for now
  }
  return (
    <tr key={expense.id} className="expense">
      <td>{expense.name}</td>
      <td>${expense.amount.periodicCost.toFixed(2)}</td>
      <td>{interval}</td>
      <td>${calculateIntervalCost(getYearlyValue(expense, incomes), interval).toFixed(2)}</td>
      <td className={adding ? "hidden" : "plus"}>
        <button onClick={() => setAdding(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </td>
    </tr>
  );
}

interface ExpenseTableProps {
  interval: "week" | "month" | "year" | number;
}

export default function ExpenseTable({ interval }: ExpenseTableProps) {
  const expenses = useExpenses();
  const setExpense = useSetExpense();

  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpensePeriodicCost, setNewExpensePeriodicCost] = useState(0);
  const [newExpensePeriodDays, setNewExpensePeriodDays] = useState(0);

  const [adding, setAdding] = useState(false);

  const addReady = newExpenseName && newExpensePeriodicCost && newExpensePeriodDays;
  const noExpenses = Object.keys(expenses).length === 0;

  const totalPeriodicCost = Object.values(expenses).reduce((sum, expense) => {
    if (expense.amount.kind === "flat") {
      return sum + calculateIntervalCost(expense.amount.periodicCost * (365 / expense.amount.periodicDays), interval);
    }
    return sum;
  }, 0);

  const handleAddExpense = () => {
    if (newExpenseName && newExpensePeriodicCost > 0 && newExpensePeriodDays > 0) {
      setExpense({
        id: v4(),
        name: newExpenseName,
        taxRouteIds: [],
        amount: {
          kind: "flat",
          periodicCost: newExpensePeriodicCost,
          periodicDays: newExpensePeriodDays,
        },
      });
    }
    setNewExpenseName("");
    setNewExpensePeriodicCost(0);
    setNewExpensePeriodDays(0);
    setAdding(false);
  };

  return (
    <table className="expense-table">
      <thead className="header">
        <tr>
          <th>Name</th>
          <th>Cost</th>
          <th>Frequency</th>
          <th>Cost per {interval}</th>
          <th className="hidden"></th>
        </tr>
      </thead>
      <tbody className="body">
        {Object.values(expenses).map((expense) => (
          <ExpenseRow key={expense.id} interval={interval} expense={expense} adding={adding} setAdding={setAdding} />
        ))}
        <tr className={adding || noExpenses ? "add" : "hidden"}>
          <td>
            <input
              type="text"
              placeholder="Expense name"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
            />
          </td>
          <td>
            <input
              type="number"
              placeholder="Cost"
              value={newExpensePeriodicCost}
              onChange={(e) => setNewExpensePeriodicCost(Number(e.target.value))}
            />
          </td>
          <td>
            <IntervalSelector
              interval={newExpensePeriodDays}
              setInterval={(value) => {
                setNewExpensePeriodDays(convertIntervalToDays(value));
              }}
            />
          </td>
          <td></td>
          <td>
            <button onClick={handleAddExpense} className={addReady ? "ready" : ""} disabled={noExpenses && !addReady}>
              {addReady || noExpenses ? "Add" : "Cancel"}
            </button>
          </td>
        </tr>
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
