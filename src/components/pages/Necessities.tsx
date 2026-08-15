import { useNecessitiesStore } from "../../store/ExpensesStore";
import { useState } from "react";
import ExpenseTable from "../ui/ExpenseTable";

export default function Necessities() {
  const necessities = useNecessitiesStore((state) => state.expenses);
  const addNecessity = useNecessitiesStore((state) => state.addExpense);

  const [timeframe, setTimeFrame] = useState<
    "week" | "month" | "year" | "paycheck"
  >("month");

  return (
    <ExpenseTable
      timeframe={timeframe}
      addExpense={addNecessity}
      expenses={necessities}
    />
  );
}
