import { useNecessitiesStore } from "../../store/ExpensesStore";
import { useState } from "react";
import ExpenseTable from "../ui/ExpenseTable";
import TimeframeSelector from "../ui/TimeframeSelector";

export default function Necessities() {
  const necessities = useNecessitiesStore((state) => state.expenses);
  const addNecessity = useNecessitiesStore((state) => state.addExpense);

  const [timeframe, setTimeFrame] = useState<
    "week" | "month" | "year" | "paycheck" | number
  >("month");

  return (
    <>
      <TimeframeSelector timeframe={timeframe} setTimeFrame={setTimeFrame} />
      <ExpenseTable
        timeframe={timeframe}
        addExpense={addNecessity}
        expenses={necessities}
      />
    </>
  );
}
