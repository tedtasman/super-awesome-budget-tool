import type { Expense } from "../state/store/expenses";
import { useFinancialStore } from "../state/store";
import { useState } from "react";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TimeframeSelector from "./TimeframeSelector";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import "./styles/ExpenseTable.css";

interface ExpenseTableProps {
  timeframe: "week" | "month" | "year" | "paycheck" | number;
  addExpense: (expense: Expense) => void;
  expenses: Record<string, Expense>;
}

export default function ExpenseTable({ timeframe, addExpense, expenses }: ExpenseTableProps) {
  const paychecksPerYear = useFinancialStore((state) => state.paychecksPerYear);

  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseCost, setNewExpenseCost] = useState(0);
  const [newExpenseFrequencyDays, setNewExpenseFrequencyDays] = useState(0);
  const [adding, setAdding] = useState(false);

  const addReady = newExpenseName && newExpenseCost && newExpenseFrequencyDays;
  const noExpenses = Object.keys(expenses).length === 0;

  const calculatePeriodicCost = (cost: number, frequencyDays: number) => {
    const daysInPeriod = convertTimeframeToDays(timeframe);
    return (cost / frequencyDays) * daysInPeriod;
  };

  const convertTimeframeToDays = (timeframe: "week" | "month" | "year" | "paycheck" | number) => {
    if (typeof timeframe === "number") {
      return timeframe;
    }
    return {
      week: 7,
      month: 30,
      year: 365,
      paycheck: 365 / paychecksPerYear,
    }[timeframe];
  };

  const totalPeriodicCost = Object.values(expenses).reduce(
    (total, expense) => total + calculatePeriodicCost(expense.cost, expense.frequencyDays),
    0,
  );

  const handleAddExpense = () => {
    if (newExpenseName && newExpenseCost > 0 && newExpenseFrequencyDays > 0) {
      addExpense({
        id: v4(),
        name: newExpenseName,
        cost: newExpenseCost,
        frequencyDays: newExpenseFrequencyDays,
      });
    }
    setNewExpenseName("");
    setNewExpenseCost(0);
    setNewExpenseFrequencyDays(0);
    setAdding(false);
  };

  return (
    <table className="expense-table">
      <thead className="header">
        <tr>
          <th>Name</th>
          <th>Cost</th>
          <th>Frequency</th>
          <th>Cost per {timeframe}</th>
          <th className="hidden"></th>
        </tr>
      </thead>
      <tbody className="body">
        {Object.values(expenses).map((expense) => (
          <tr key={expense.id} className="expense">
            <td>{expense.name}</td>
            <td>${expense.cost.toFixed(2)}</td>
            <td>{expense.frequencyDays} days</td>
            <td>${calculatePeriodicCost(expense.cost, expense.frequencyDays).toFixed(2)}</td>
            <td className={adding ? "hidden" : "plus"}>
              <button onClick={() => setAdding(true)}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </td>
          </tr>
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
              value={newExpenseCost}
              onChange={(e) => setNewExpenseCost(Number(e.target.value))}
            />
          </td>
          <td>
            <TimeframeSelector
              timeframe={newExpenseFrequencyDays}
              setTimeFrame={(value) => {
                setNewExpenseFrequencyDays(convertTimeframeToDays(value));
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
