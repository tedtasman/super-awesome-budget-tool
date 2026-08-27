import { savingsHooks } from "../state/hooks/expenses";
import { useState } from "react";
import ExpenseTable from "../ui/ExpenseTable";
import TimeframeSelector from "../ui/TimeframeSelector";
import PreTaxExpenseTable from "../ui/PreTaxExpenseTable";

import "./styles/Expenses.css";
import PageCore from "../ui/PageCore";

export default function Savings() {
  const savings = savingsHooks.useExpenses();
  const addSaving = savingsHooks.useAddExpense();

  const [timeframe, setTimeFrame] = useState<"week" | "month" | "year" | "paycheck" | number>("month");

  return (
    <PageCore
      pageTitle="Savings"
      className="expenses-base"
      actions={<TimeframeSelector timeframe={timeframe} setTimeFrame={setTimeFrame} />}
    >
      <PreTaxExpenseTable timeframe={timeframe} addExpense={addSaving} expenses={savings} />
      <ExpenseTable timeframe={timeframe} addExpense={addSaving} expenses={savings} />
    </PageCore>
  );
}
