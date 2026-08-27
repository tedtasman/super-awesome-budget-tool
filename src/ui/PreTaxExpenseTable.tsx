import type { PaycheckDeduction } from "../state/store/expenses";
import {
  usePaycheck,
  usePaychecksPerYear,
  usePreTaxDeductionValuePerPaycheck,
  useSalary,
  useSetPaychecksPerYear,
  useSetSalary,
  useValueIfTaxed,
} from "../state/hooks/financial";
import { useState } from "react";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import "./styles/ExpenseTable.css";

interface PreTaxExpenseRowProps {
  expense: PaycheckDeduction;
  adding: boolean;
  setAdding: (adding: boolean) => void;
}

export function PreTaxExpenseRow({ expense, adding, setAdding }: PreTaxExpenseRowProps) {
  const getValuePerPaycheck = usePreTaxDeductionValuePerPaycheck;
  const valueIfTaxed = useValueIfTaxed(getValuePerPaycheck(expense));

  return (
    <tr key={expense.id} className="expense">
      <td>{expense.name}</td>
      <td>{(expense.percentage * 100).toFixed(2)}%</td>
      <td>${expense.flatAmount.toFixed(2)}</td>
      <td>${getValuePerPaycheck(expense).toFixed(2)}</td>
      <td>${valueIfTaxed.toFixed(2)}</td>
      <td className={adding ? "hidden" : "plus"}>
        <button onClick={() => setAdding(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </td>
    </tr>
  );
}

interface PreTaxExpenseTableProps {
  timeframe: "week" | "month" | "year" | "paycheck" | number;
  expenseHooks: {
    usePreTaxDeductions: () => Record<string, PaycheckDeduction>;
    useAddPreTaxDeduction: () => (expense: PaycheckDeduction) => void;
  };
}

export default function PreTaxExpenseTable({ timeframe, expenseHooks }: PreTaxExpenseTableProps) {
  // const paychecksPerYear = usePaychecksPerYear();

  const salary = useSalary();
  const setSalary = useSetSalary();
  const paychecksPerYear = usePaychecksPerYear();
  const setPaychecksPerYear = useSetPaychecksPerYear();

  const paycheck = usePaycheck();

  const preTaxDeductions = expenseHooks.usePreTaxDeductions();
  const addPreTaxDeduction = expenseHooks.useAddPreTaxDeduction();

  const [newExpenseName, setNewExpenseName] = useState("");
  const [newDeductionPercentage, setNewDeductionPercentage] = useState(0);
  const [newDeductionFlatAmount, setNewDeductionFlatAmount] = useState(0);
  const [adding, setAdding] = useState(false);

  const addReady =
    newExpenseName &&
    (newDeductionPercentage > 0 || newDeductionFlatAmount > 0) &&
    newDeductionPercentage <= 100 &&
    newDeductionPercentage >= 0 &&
    newDeductionFlatAmount >= 0;
  const noExpenses = Object.keys(preTaxDeductions).length === 0;

  const totalPercentage = Object.values(preTaxDeductions).reduce((total, expense) => total + expense.percentage, 0);
  const totalFlatAmount = Object.values(preTaxDeductions).reduce((total, expense) => total + expense.flatAmount, 0);
  const totalPreTaxValuePerPaycheck = totalPercentage * paycheck + totalFlatAmount; // can't use the hook because it requires a deduction object, so we calculate it manually here. Whatever...
  const totalPostTaxValuePerPaycheck = useValueIfTaxed(totalPreTaxValuePerPaycheck);

  // const calculatePeriodicCost = (cost: number, frequencyDays: number) => {
  //   const daysInPeriod = convertTimeframeToDays(timeframe);
  //   return (cost / frequencyDays) * daysInPeriod;
  // };

  // const convertTimeframeToDays = (timeframe: "week" | "month" | "year" | "paycheck" | number) => {
  //   if (typeof timeframe === "number") {
  //     return timeframe;
  //   }
  //   return {
  //     week: 7,
  //     month: 30,
  //     year: 365,
  //     paycheck: 365 / paychecksPerYear,
  //   }[timeframe];
  // };

  // const totalPeriodicCost = Object.values(preTaxDeductions).reduce(
  //   (total, expense) => total + calculatePeriodicCost(expense.cost, expense.frequencyDays),
  //   0,
  // );

  const handleAddExpense = () => {
    if (addReady) {
      addPreTaxDeduction({
        id: v4(),
        name: newExpenseName,
        percentage: newDeductionPercentage / 100,
        flatAmount: newDeductionFlatAmount,
      });
    }
    setNewExpenseName("");
    setNewDeductionPercentage(0);
    setNewDeductionFlatAmount(0);
    setAdding(false);
  };

  return (
    <>
      <input type="number" placeholder="salary" value={salary} onChange={(e) => setSalary(Number(e.target.value))} />
      <input
        type="number"
        placeholder="paychecks per year"
        value={paychecksPerYear}
        onChange={(e) => setPaychecksPerYear(Number(e.target.value))}
      />
      <table className="expense-table">
        <thead className="header">
          <tr>
            <th>Name</th>
            <th>Percent of Paycheck</th>
            <th>Flat Amount per Paycheck</th>
            <th>Pre Tax Value per {timeframe}</th>
            <th>Post Tax Value per {timeframe}</th>
            <th className="hidden"></th>
          </tr>
        </thead>
        <tbody className="body">
          {Object.values(preTaxDeductions).map((expense) => (
            <PreTaxExpenseRow key={expense.id} expense={expense} adding={adding} setAdding={setAdding} />
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
                placeholder="Percentage"
                value={newDeductionPercentage}
                onChange={(e) => setNewDeductionPercentage(Number(e.target.value))}
              />
            </td>
            <td>
              <input
                type="number"
                placeholder="Flat Amount"
                value={newDeductionFlatAmount}
                onChange={(e) => setNewDeductionFlatAmount(Number(e.target.value))}
              />
            </td>
            <td></td>
            <td></td>
            <td>
              <button onClick={handleAddExpense} className={addReady ? "ready" : ""} disabled={noExpenses && !addReady}>
                {addReady || noExpenses ? "Add" : "Cancel"}
              </button>
            </td>
          </tr>
          <tr className="total">
            <td>Total</td>
            <td>{(totalPercentage * 100).toFixed(2)}%</td>
            <td>{totalFlatAmount.toFixed(2)}</td>
            <td>{totalPreTaxValuePerPaycheck.toFixed(2)}</td>
            <td>{totalPostTaxValuePerPaycheck.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
