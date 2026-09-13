import { useState } from "react";
import FlatExpenseTable from "./FlatExpenseTable";
import IntervalSelector from "../../ui/IntervalSelector";
import PageCore from "../../ui/PageCore";
import ModalOverlay from "../../ui/ModalOverlay";
import { useExpenses, useIncomes, useSetExpense, useTaxRoutes } from "../../state/hooks";
import type { Expense, ExpenseAmount } from "../../state/interface/expense";

export default function Expenses() {
  // ====== Store hooks ========
  const setExpense = useSetExpense();
  const expenses = useExpenses();
  const incomes = useIncomes();
  const taxRoutes = useTaxRoutes();
  // ====== End store hooks ========

  // ====== Computed data ========
  const incomeArray = Object.keys(incomes);
  const taxRouteArray = Object.keys(taxRoutes);
  const hasIncomes = incomeArray.length > 0;

  const expensesByIncomeId = Object.values(expenses)
    .filter((expense) => expense.type === "tiedToIncome")
    .reduce(
      (acc, expense) => {
        const incomeId = expense.incomeId;
        if (!acc[incomeId]) {
          acc[incomeId] = [];
        }
        acc[incomeId].push(expense);
        return acc;
      },
      {} as Record<string, Expense[]>,
    );
  const relevantIncomes = Object.keys(expensesByIncomeId);

  const recurringExpenses: Record<string, Expense> = Object.values(expenses)
    .filter((expense) => expense.type === "recurring")
    .reduce(
      (acc, expense) => {
        acc[expense.id] = expense;
        return acc;
      },
      {} as Record<string, Expense>,
    );

  // ====== End computed data ========

  const [interval, setInterval] = useState<"week" | "month" | "year" | number>("month");

  // ====== Adding expense state ========
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseReducedTaxRouteIds, setNewExpenseReducedTaxRouteIds] = useState<Set<string>>(new Set());
  const [newExpenseType, setNewExpenseType] = useState<"recurring" | "tiedToIncome">("recurring");

  const [newRecurringCadence, setNewRecurringCadence] = useState(30);
  const [newRecurringCost, setNewRecurringCost] = useState(0);

  const [newExpenseIncomeId, setNewExpenseIncomeId] = useState(hasIncomes ? incomeArray[0] : "");
  const [newExpenseAmountKind, setNewExpenseAmountKind] = useState<"flat" | "percentage">("flat");
  const [newExpenseFlatCost, setNewExpenseFlatCost] = useState(0);
  const [newExpensePercentageDecimalValue, setNewExpensePercentageDecimalValue] = useState(0);
  const newExpenseAmount: ExpenseAmount =
    newExpenseAmountKind === "flat"
      ? { kind: "flat", cost: newExpenseFlatCost }
      : { kind: "percentage", decimalValue: newExpensePercentageDecimalValue };

  const [addingExpense, setAddingExpense] = useState(false);
  const addReady =
    newExpenseName &&
    (newExpenseType === "recurring"
      ? newRecurringCost > 0 && newRecurringCadence > 0
      : (newExpenseAmountKind === "flat" && newExpenseFlatCost > 0) ||
        (newExpenseAmountKind === "percentage" && newExpensePercentageDecimalValue > 0));
  // ====== End adding expense state ========

  // ====== Handlers ========
  const handleAddExpense = () => {
    if (!addReady) {
      return;
    }

    const newExpense: Expense =
      newExpenseType === "recurring"
        ? {
            id: crypto.randomUUID(),
            name: newExpenseName,
            reducedTaxRouteIds: newExpenseReducedTaxRouteIds,
            type: newExpenseType,
            cadence: newRecurringCadence,
            cost: newRecurringCost,
          }
        : {
            id: crypto.randomUUID(),
            name: newExpenseName,
            reducedTaxRouteIds: newExpenseReducedTaxRouteIds,
            type: newExpenseType,
            incomeId: newExpenseIncomeId,
            amount: newExpenseAmount,
          };

    setExpense(newExpense);
    setNewExpenseName("");
    setNewExpenseType("recurring");
    setNewRecurringCadence(30);
    setNewRecurringCost(0);
    setNewExpenseReducedTaxRouteIds(new Set());
    setNewExpenseAmountKind("flat");
    setNewExpenseFlatCost(0);
    setNewExpensePercentageDecimalValue(0);
    setAddingExpense(false);
  };

  const handleSelectExpenseType = (value: string) => {
    if (value === "recurring") {
      setNewExpenseType("recurring");
    } else if (incomeArray.includes(value)) {
      setNewExpenseType("tiedToIncome");
      setNewExpenseIncomeId(value);
    }
  };
  // ====== End handlers ========

  return (
    <PageCore
      pageTitle="Expenses"
      className=""
      actions={<IntervalSelector interval={interval} setInterval={setInterval} />}
    >
      {relevantIncomes.map((incomeId) => (
        <div key={incomeId}>
          <h3>{incomes[incomeId].name}</h3>
          {/* <ExpenseTable interval={interval} /> */}
        </div>
      ))}

      <h3>General</h3>
      <FlatExpenseTable interval={interval} expenses={recurringExpenses} />
      <button onClick={() => setAddingExpense(true)}>Add Expense</button>

      {/* Add expense modal */}
      <ModalOverlay isOpen={addingExpense} onClose={() => setAddingExpense(false)}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddExpense();
          }}
        >
          <input
            type="text"
            placeholder="Expense Name"
            value={newExpenseName}
            onChange={(e) => setNewExpenseName(e.target.value)}
          />
          <select
            value={newExpenseType === "recurring" ? "recurring" : newExpenseIncomeId}
            onChange={(e) => handleSelectExpenseType(e.target.value)}
          >
            <option value="recurring">Recurring</option>
            {incomeArray.map((id) => (
              <option key={id} value={id}>
                Tied to {incomes[id].name}
              </option>
            ))}
          </select>
          <select
            value={Array.from(newExpenseReducedTaxRouteIds).join(",")}
            onChange={(e) => setNewExpenseReducedTaxRouteIds(new Set(e.target.value.split(",").map((id) => id.trim())))}
          >
            {taxRouteArray.map((id) => (
              <option key={id} value={id}>
                {taxRoutes[id].name}
              </option>
            ))}
          </select>
          {newExpenseType === "recurring" ? (
            <>
              <input
                type="number"
                placeholder="Cadence (Days)"
                value={newRecurringCadence}
                onChange={(e) => setNewRecurringCadence(Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="Cost"
                value={newRecurringCost}
                onChange={(e) => setNewRecurringCost(Number(e.target.value))}
              />
            </>
          ) : (
            <>
              <select
                value={newExpenseAmountKind}
                onChange={(e) => setNewExpenseAmountKind(e.target.value as "flat" | "percentage")}
              >
                <option value="flat">Flat</option>
                <option value="percentage">Percentage</option>
              </select>
              {newExpenseAmountKind === "flat" ? (
                <>
                  <input
                    type="number"
                    placeholder="Flat Cost"
                    value={newExpenseFlatCost}
                    onChange={(e) => setNewExpenseFlatCost(Number(e.target.value))}
                  />
                </>
              ) : (
                <>
                  <input
                    type="number"
                    placeholder="Percentage"
                    value={newExpensePercentageDecimalValue}
                    onChange={(e) => setNewExpensePercentageDecimalValue(Number(e.target.value))}
                  />
                </>
              )}
            </>
          )}

          <button type="submit" className={addReady ? "ready" : ""} disabled={!addReady}>
            Add Expense
          </button>
        </form>
      </ModalOverlay>
      {/* End add expense modal */}
    </PageCore>
  );
}
