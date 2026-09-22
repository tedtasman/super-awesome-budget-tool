import Select from "react-select";

import PageCore from "../../ui/PageCore";
import { useSetIncome, useIncomes, useRemoveIncome, useTaxRoutes } from "../../state/hooks";
import YearlyIncome from "./YearlyIncome";
import { useState } from "react";
import ModalOverlay from "../../ui/ModalOverlay";

import "./Income.css";

export default function Income() {
  // ====== Store hooks ========
  const incomes = useIncomes();
  const setIncome = useSetIncome();
  const removeIncome = useRemoveIncome();
  const taxRoutes = useTaxRoutes();
  // ====== End store hooks ========

  // ====== Computed data ========
  const incomeArray = Object.values(incomes);
  const hasIncomes = Object.keys(incomes).length > 0;
  const taxRouteArray = Object.values(taxRoutes);
  // ====== End computed data ========

  // ====== Adding income state ========
  const [newIncomeName, setNewIncomeName] = useState("");
  const [newIncomeAnchorDate, setNewIncomeAnchorDate] = useState(new Date().toISOString().split("T")[0]);
  const [newIncomePayPeriodDays, setNewIncomePayPeriodDays] = useState(14);
  const [newIncomeTaxRouteIds, setNewIncomeTaxRouteIds] = useState<string[]>([]);
  const [addingIncome, setAddingIncome] = useState(false);
  const addReady = newIncomeName.trim() !== "" && newIncomePayPeriodDays > 0 && newIncomeAnchorDate.trim() !== "";
  // ====== End adding income state ========

  // ====== Editing incomes state ========
  const [editingIncomes, setEditingIncomes] = useState(false);
  const [evictedIncomeIds, setEvictedIncomeIds] = useState<Set<string>>(new Set());
  // ====== End editing incomes state ========

  // ====== Year state ========
  const [year, setYear] = useState(new Date().getFullYear());
  // ====== End year state ========

  // ====== Handlers ========
  const handleAddIncome = () => {
    if (!addReady) return;
    const newIncome = {
      id: crypto.randomUUID(),
      name: newIncomeName,
      taxRouteIds: new Set(newIncomeTaxRouteIds),
      lines: {},
      payPeriodDays: newIncomePayPeriodDays,
      anchorDate: newIncomeAnchorDate,
      cadenceAdjustments: [],
    };
    setIncome(newIncome);
    setNewIncomeName("");
    setNewIncomeAnchorDate(new Date().toISOString().split("T")[0]);
    setNewIncomePayPeriodDays(14);
    setNewIncomeTaxRouteIds([]);
    setAddingIncome(false);
  };

  const handleEditSubmit = (incomeIds: Set<string>) => {
    incomeIds.forEach((id) => {
      removeIncome(id);
    });
    setEvictedIncomeIds(new Set());
    setEditingIncomes(false);
  };
  // ====== End handlers ========

  return (
    <PageCore
      pageTitle="Income"
      className="income"
      actions={
        <>
          <button onClick={() => setEditingIncomes(!editingIncomes)}>{editingIncomes ? "Done" : "Edit"}</button>
          <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        </>
      }
    >
      <div className="list">
        {!hasIncomes ? (
          <p>No incomes found.</p>
        ) : (
          incomeArray.map((income) => <YearlyIncome key={income.id} income={income} year={year} />)
        )}
      </div>
      <button onClick={() => setAddingIncome(true)}>Add Income</button>

      {/* Add income modal */}
      <ModalOverlay isOpen={addingIncome} onClose={() => setAddingIncome(false)}>
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
          <Select
            isMulti
            options={taxRouteArray.map((route) => ({ value: route.id, label: route.name }))}
            placeholder="Select Tax Routes"
            value={newIncomeTaxRouteIds.map((id) => {
              const route = taxRouteArray.find((r) => r.id === id);
              return route ? { value: route.id, label: route.name } : null;
            })}
            onChange={(selectedOptions) => {
              setNewIncomeTaxRouteIds(Array.from(selectedOptions, (option) => option?.value || ""));
            }}
          />
          <button type="submit" disabled={!addReady}>
            Add Income
          </button>
        </form>
      </ModalOverlay>
      {/* End add income modal */}

      {/* Edit incomes modal */}
      <ModalOverlay isOpen={editingIncomes} onClose={() => setEditingIncomes(false)} title="Edit Incomes">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditSubmit(evictedIncomeIds);
          }}
        >
          <div className="edit-list">
            {incomeArray.map((income) => (
              <div key={income.id} className="edit-item">
                <span>{income.name}</span>
                <input
                  type="checkbox"
                  checked={evictedIncomeIds.has(income.id)}
                  onChange={() => {
                    return evictedIncomeIds.has(income.id)
                      ? setEvictedIncomeIds((prev) => {
                          const next = new Set(prev);
                          next.delete(income.id);
                          return next;
                        })
                      : setEvictedIncomeIds((prev) => new Set(prev).add(income.id));
                  }}
                ></input>
              </div>
            ))}
          </div>
          <button type="submit">Submit Changes</button>
        </form>
      </ModalOverlay>
      {/* End edit incomes modal */}
    </PageCore>
  );
}
