import type { Expense } from "../../store/ExpensesStore";
import { useFinancialStore } from "../../store/FinancialStore";
import { useState } from "react";
import { v4 } from "uuid";
import TimeframeSelector from "./TimeframeSelector";

interface ExpenseTableProps {
  timeframe: "week" | "month" | "year" | "paycheck" | number;
  addExpense: (expense: Expense) => void;
  expenses: Record<string, Expense>;
}

export default function ExpenseTable({
  timeframe,
  addExpense,
  expenses,
}: ExpenseTableProps) {
  const paychecksPerYear = useFinancialStore((state) => state.paychecksPerYear);

  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseCost, setNewExpenseCost] = useState(0);
  const [newExpenseFrequencyDays, setNewExpenseFrequencyDays] = useState(0);

  const calculatePeriodicCost = (cost: number, frequencyDays: number) => {
    const daysInPeriod = convertTimeframeToDays(timeframe);
    return (cost / frequencyDays) * daysInPeriod;
  };

  const convertTimeframeToDays = (
    timeframe: "week" | "month" | "year" | "paycheck" | number,
  ) => {
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

  const handleAddExpense = () => {
    if (newExpenseName && newExpenseCost > 0 && newExpenseFrequencyDays > 0) {
      addExpense({
        id: v4(),
        name: newExpenseName,
        cost: newExpenseCost,
        frequencyDays: newExpenseFrequencyDays,
      });
      setNewExpenseName("");
      setNewExpenseCost(0);
      setNewExpenseFrequencyDays(0);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Frequency</th>
            <th>Cost per {timeframe}</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(expenses).map((expense) => (
            <tr key={expense.id}>
              <td>{expense.name}</td>
              <td>${expense.cost.toFixed(2)}</td>
              <td>{expense.frequencyDays} days</td>
              <td>
                $
                {calculatePeriodicCost(
                  expense.cost,
                  expense.frequencyDays,
                ).toFixed(2)}
              </td>
            </tr>
          ))}
          <tr>
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
            <td>
              <button onClick={handleAddExpense}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
