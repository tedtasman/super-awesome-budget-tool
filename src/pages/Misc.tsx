import { miscHooks } from "../state/hooks/expenses";
import { useState } from "react";
import ExpenseTable from "../ui/ExpenseTable";
import TimeframeSelector from "../ui/TimeframeSelector";
import PreTaxExpenseTable from "../ui/PreTaxExpenseTable";

import "./styles/Expenses.css";
import PageCore from "../ui/PageCore";

export default function Misc() {
  const miscs = miscHooks.useExpenses();
  const addMisc = miscHooks.useAddExpense();

  const [timeframe, setTimeFrame] = useState<"week" | "month" | "year" | "paycheck" | number>("month");

  return (
    <PageCore
      pageTitle="Miscellaneous"
      className="expenses-base"
      actions={<TimeframeSelector timeframe={timeframe} setTimeFrame={setTimeFrame} />}
    >
      <PreTaxExpenseTable timeframe={timeframe} addExpense={addMisc} expenses={miscs} />
      <ExpenseTable timeframe={timeframe} addExpense={addMisc} expenses={miscs} />
    </PageCore>
  );
}
