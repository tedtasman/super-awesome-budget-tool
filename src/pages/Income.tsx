import PageCore from "../ui/PageCore";
import { useSetIncome, useIncomes } from "../state/hooks";
import IncomeTable from "../ui/YearlyIncome";
import { useState } from "react";

export default function Income() {
  const incomes = useIncomes();
  const incomeArray = Object.values(incomes);
  const setIncome = useSetIncome();

  const [newIncomeName, setNewIncomeName] = useState("");
  const [newIncomeAnchorDate, setNewIncomeAnchorDate] = useState(new Date().toISOString().split("T")[0]);
  const [newIncomePayPeriodDays, setNewIncomePayPeriodDays] = useState(14);

  const handleAddIncome = () => {
    const newIncome = {
      id: crypto.randomUUID(),
      name: newIncomeName,
      taxRouteIds: new Set<string>(),
      streams: {},
      payPeriodDays: newIncomePayPeriodDays,
      anchorDate: newIncomeAnchorDate,
      cadenceAdjustments: [],
    };
    setIncome(newIncome);
    setNewIncomeName("");
    setNewIncomeAnchorDate(new Date().toISOString().split("T")[0]);
    setNewIncomePayPeriodDays(14);
  };

  const noIncomes = Object.keys(incomes).length === 0;

  console.log("incomes", incomes);

  return (
    <PageCore pageTitle="Income" className="">
      {noIncomes ? (
        <p>No incomes found.</p>
      ) : (
        incomeArray.map((income) => <IncomeTable key={income.id} income={income} />)
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddIncome();
        }}
      >
        <input
          type="text"
          placeholder="Income Name"
          value={newIncomeName}
          onChange={(e) => setNewIncomeName(e.target.value)}
        />
        <input type="date" value={newIncomeAnchorDate} onChange={(e) => setNewIncomeAnchorDate(e.target.value)} />
        <input
          type="number"
          placeholder="Pay Period (Days)"
          value={newIncomePayPeriodDays}
          onChange={(e) => setNewIncomePayPeriodDays(Number(e.target.value))}
        />
        <button type="submit">Add Income</button>
      </form>
    </PageCore>
  );
}
