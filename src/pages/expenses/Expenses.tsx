import { useState } from "react";
import ExpenseTable from "./ExpenseTable";
import IntervalSelector from "../../ui/IntervalSelector";
import PageCore from "../../ui/PageCore";

export default function Expenses() {
  const [interval, setInterval] = useState<"week" | "month" | "year" | number>("month");

  return (
    <PageCore
      pageTitle="Expenses"
      className=""
      actions={<IntervalSelector interval={interval} setInterval={setInterval} />}
    >
      <ExpenseTable interval={interval} />
    </PageCore>
  );
}
