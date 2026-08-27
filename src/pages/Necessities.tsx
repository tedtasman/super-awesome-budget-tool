import { necessitiesHooks } from "../state/hooks/expenses";
import { useState } from "react";
import ExpenseTable from "../ui/ExpenseTable";
import TimeframeSelector from "../ui/TimeframeSelector";
import PreTaxExpenseTable from "../ui/PreTaxExpenseTable";

import "./styles/Expenses.css";
import PageCore from "../ui/PageCore";

export default function Necessities() {
  const necessities = necessitiesHooks.useExpenses();
  const addNecessity = necessitiesHooks.useAddExpense();

  const [timeframe, setTimeFrame] = useState<"week" | "month" | "year" | "paycheck" | number>("month");

  return (
    <PageCore
      pageTitle="Necessities"
      className="expenses-base"
      actions={<TimeframeSelector timeframe={timeframe} setTimeFrame={setTimeFrame} />}
    >
      <PreTaxExpenseTable timeframe={timeframe} expenseHooks={necessitiesHooks} />
      <ExpenseTable timeframe={timeframe} addExpense={addNecessity} expenses={necessities} />
    </PageCore>
  );
}
