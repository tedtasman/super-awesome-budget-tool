import { useState } from "react";
import { useIncomes, useSetExpense, useTaxRoutes } from "../../state/hooks";
import type { Expense, ExpenseAmount } from "../../state/interface/expense";
import FlatExpenseTable from "./FlatExpenseTable";
import ModalOverlay from "../../ui/ModalOverlay";

interface CategoryProps {
  interval: "week" | "month" | "year" | number;
  expenses: Record<string, Expense>;
  categoryId: string;
}

export default function Category({ interval, expenses, categoryId }: CategoryProps) {
  const incomes = useIncomes();
  const setExpense = useSetExpense();
  const taxRoutes = useTaxRoutes();

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
            categoryId: categoryId,
            cadence: newRecurringCadence,
            cost: newRecurringCost,
          }
        : {
            id: crypto.randomUUID(),
            name: newExpenseName,
            reducedTaxRouteIds: newExpenseReducedTaxRouteIds,
            type: newExpenseType,
            categoryId: categoryId,
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
    <>
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
          <div className="form-group">
            <label htmlFor="expense-name">Expense Name</label>
            <input
              id="expense-name"
              type="text"
              placeholder="Expense Name"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="expense-type">Expense Type</label>
            <select
              id="expense-type"
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
          </div>
          <div className="form-group">
            <label htmlFor="expense-tax-routes">Reduced Tax Routes</label>
            <select
              id="expense-tax-routes"
              value={Array.from(newExpenseReducedTaxRouteIds).join(",")}
              onChange={(e) =>
                setNewExpenseReducedTaxRouteIds(new Set(e.target.value.split(",").map((id) => id.trim())))
              }
            >
              {taxRouteArray.map((id) => (
                <option key={id} value={id}>
                  {taxRoutes[id].name}
                </option>
              ))}
            </select>
          </div>
          {newExpenseType === "recurring" ? (
            <>
              <div className="form-group">
                <label htmlFor="recurring-cadence">Cadence (Days)</label>
                <input
                  id="recurring-cadence"
                  type="number"
                  placeholder="Cadence (Days)"
                  value={newRecurringCadence}
                  onChange={(e) => setNewRecurringCadence(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="recurring-cost">Cost</label>
                <input
                  id="recurring-cost"
                  type="number"
                  placeholder="Cost"
                  value={newRecurringCost}
                  onChange={(e) => setNewRecurringCost(Number(e.target.value))}
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="expense-amount-kind">Amount Kind</label>
                <select
                  id="expense-amount-kind"
                  value={newExpenseAmountKind}
                  onChange={(e) => setNewExpenseAmountKind(e.target.value as "flat" | "percentage")}
                >
                  <option value="flat">Flat</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
              {newExpenseAmountKind === "flat" ? (
                <div className="form-group">
                  <label htmlFor="expense-flat-cost">Flat Cost</label>
                  <input
                    id="expense-flat-cost"
                    type="number"
                    placeholder="Flat Cost"
                    value={newExpenseFlatCost}
                    onChange={(e) => setNewExpenseFlatCost(Number(e.target.value))}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="expense-percentage">Percentage</label>
                  <input
                    id="expense-percentage"
                    type="number"
                    placeholder="Percentage"
                    value={newExpensePercentageDecimalValue}
                    onChange={(e) => setNewExpensePercentageDecimalValue(Number(e.target.value))}
                  />
                </div>
              )}
            </>
          )}

          <button type="submit" className={addReady ? "ready" : ""} disabled={!addReady}>
            Add Expense
          </button>
        </form>
      </ModalOverlay>
      {/* End add expense modal */}
    </>
  );
}
