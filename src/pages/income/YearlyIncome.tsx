import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { useSetIncomeLine } from "../../state/hooks";

import "../expenses/ExpenseTable.css";
import type { Income, IncomeLine, LineCadence } from "../../state/interface/income";
import { getMonthlyLineTotals } from "../../state/calc/occurrences";

interface IncomeRowProps {
  line: IncomeLine;
  adding: boolean;
  setAdding: (adding: boolean) => void;
  yearlyTotal: number;
}
function HourlyIncomeRow({ line, adding, setAdding, yearlyTotal }: IncomeRowProps) {
  if (line.kind !== "hourly") {
    throw new Error("HourlyIncomeRow can only be used with hourly income lines");
  }

  return (
    <tr key={line.id} className="expense">
      <td></td>
      <td>{line.name}</td>
      <td>${line.hourlyRate.toFixed(2)}</td>
      <td>{line.hoursPerPeriod} hours per pay period</td>
      <td>{line.cadence.kind === "everyPaycheck" ? "Every Paycheck" : `Every ${line.cadence.n} Days`}</td>
      <td>${yearlyTotal.toFixed(2)}</td>
      <td className={adding ? "hidden" : "plus"}>
        <button onClick={() => setAdding(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </td>
    </tr>
  );
}

function SalaryIncomeRow({ line, adding, setAdding, yearlyTotal }: IncomeRowProps) {
  if (line.kind !== "salary") {
    throw new Error("SalaryIncomeRow can only be used with salary income lines");
  }

  return (
    <tr key={line.id} className="expense">
      <td></td>
      <td>{line.name}</td>
      <td>${line.annualValue.toFixed(2)}</td>
      <td></td>
      <td>{line.cadence.kind === "everyPaycheck" ? "Every Paycheck" : `Every ${line.cadence.n} Days`}</td>
      <td>${yearlyTotal.toFixed(2)}</td>
      <td className={adding ? "hidden" : "plus"}>
        <button onClick={() => setAdding(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </td>
    </tr>
  );
}

function AddSalaryForm({
  newSalaryValue,
  setNewSalaryValue,
}: {
  newSalaryValue: number;
  setNewSalaryValue: (value: number) => void;
}) {
  return (
    <>
      <td>
        <input
          type="number"
          placeholder="Annual Salary"
          value={newSalaryValue}
          onChange={(e) => setNewSalaryValue(Number(e.target.value))}
        />
      </td>
      <td></td>
    </>
  );
}

function AddHourlyForm({
  newHourlyRate,
  setNewHourlyRate,
  newHoursPerPeriod,
  setNewHoursPerPeriod,
}: {
  newHourlyRate: number;
  setNewHourlyRate: (value: number) => void;
  newHoursPerPeriod: number;
  setNewHoursPerPeriod: (value: number) => void;
}) {
  return (
    <>
      <td>
        <input
          type="number"
          placeholder="Hourly Rate"
          value={newHourlyRate}
          onChange={(e) => setNewHourlyRate(Number(e.target.value))}
        />
      </td>
      <td>
        <input
          type="number"
          placeholder="Hours per Period"
          value={newHoursPerPeriod}
          onChange={(e) => setNewHoursPerPeriod(Number(e.target.value))}
        />
      </td>
    </>
  );
}
interface YearlyIncomeProps {
  income: Income;
  year: number;
}

export default function YearlyIncome({ income, year }: YearlyIncomeProps) {
  // Computed local data
  const startOfYear = new Date(`${year}-01-01`);
  const endOfYear = new Date(`${year}-12-31`);

  // End computed local data

  // Store hooks
  const setLine = useSetIncomeLine();
  // End store hooks

  // Computed store data
  const linesArray = Object.values(income.lines);
  const hourlylines = linesArray.filter((s) => s.kind === "hourly");
  const salarylines = linesArray.filter((s) => s.kind === "salary");
  const haslines = linesArray.length > 0;
  const hasSalarylines = salarylines.length > 0;
  const hasHourlylines = hourlylines.length > 0;
  const yearlyTotals = linesArray.map((line) => ({
    lineId: line.id,
    yearlyTotal: getMonthlyLineTotals(income, line, startOfYear, endOfYear).reduce(
      (sum, month) => sum + month.total,
      0,
    ),
  }));
  // End computed store data

  // Adding line state
  const [adding, setAdding] = useState(false);
  const [newLineName, setNewLineName] = useState("");
  const [newLineKind, setNewLineKind] = useState<"hourly" | "salary">("hourly");
  const [newLineCadenceN, setNewLineCadenceN] = useState(income.payPeriodDays);
  const [newHourlyRate, setNewHourlyRate] = useState(0);
  const [newHoursPerPeriod, setNewHoursPerPeriod] = useState(0);
  const [newSalaryValue, setNewSalaryValue] = useState(0);
  const addReady =
    newLineName &&
    ((newLineKind === "hourly" && newHourlyRate > 0 && newHoursPerPeriod > 0) ||
      (newLineKind === "salary" && newSalaryValue > 0));
  const newLineCadence: LineCadence =
    newLineCadenceN !== income.payPeriodDays
      ? { kind: "everyNDays", n: newLineCadenceN, anchorDate: income.anchorDate }
      : { kind: "everyPaycheck" };

  const newLine: IncomeLine =
    newLineKind === "hourly"
      ? {
          kind: "hourly",
          id: crypto.randomUUID(),
          name: newLineName,
          hourlyRate: newHourlyRate,
          hoursPerPeriod: newHoursPerPeriod,
          cadence: newLineCadence,
        }
      : {
          kind: "salary",
          id: crypto.randomUUID(),
          name: newLineName,
          annualValue: newSalaryValue,
          cadence: newLineCadence,
        };
  // End adding line state

  // Handlers
  const handleAddLine = () => {
    if (!addReady) {
      setAdding(false);
      return;
    }

    setLine(income.id, newLine);

    setAdding(false);
    setNewLineName("");
    setNewLineKind("hourly");
    setNewHourlyRate(0);
    setNewHoursPerPeriod(0);
    setNewSalaryValue(0);
    setNewLineCadenceN(income.payPeriodDays);
  };
  // End handlers

  return (
    <>
      <div>
        <div>
          <h2>{income.name}</h2>
        </div>
        <table className="expense-table">
          <tbody className="body">
            {hasSalarylines && (
              <tr className="separator">
                <td>Salary lines:</td>
                <td>Name</td>
                <td></td>
                <td></td>
                <td>Cadence</td>
                <td>Annual Value</td>
                <td className="hidden"></td>
              </tr>
            )}
            {salarylines.map((line) => (
              <SalaryIncomeRow
                key={line.id}
                line={line}
                adding={adding}
                setAdding={setAdding}
                yearlyTotal={yearlyTotals.find((t) => t.lineId === line.id)?.yearlyTotal ?? 0}
              />
            ))}
            {hasHourlylines && (
              <tr className="separator">
                <td>Hourly lines:</td>
                <td>Name</td>
                <td>Hourly Rate</td>
                <td>Hours per Period</td>
                <td>Cadence</td>
                <td>Amount per Year</td>
                <td className="hidden"></td>
              </tr>
            )}
            {hourlylines.map((line) => (
              <HourlyIncomeRow
                key={line.id}
                line={line}
                adding={adding}
                setAdding={setAdding}
                yearlyTotal={yearlyTotals.find((t) => t.lineId === line.id)?.yearlyTotal ?? 0}
              />
            ))}
            <tr className={adding || !haslines ? "add" : "hidden"}>
              <td>
                <select value={newLineKind} onChange={(e) => setNewLineKind(e.target.value as "hourly" | "salary")}>
                  <option value="hourly">Hourly</option>
                  <option value="salary">Salary</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Line name"
                  value={newLineName}
                  onChange={(e) => setNewLineName(e.target.value)}
                />
              </td>
              {newLineKind === "hourly" ? (
                <AddHourlyForm
                  newHourlyRate={newHourlyRate}
                  setNewHourlyRate={setNewHourlyRate}
                  newHoursPerPeriod={newHoursPerPeriod}
                  setNewHoursPerPeriod={setNewHoursPerPeriod}
                />
              ) : newLineKind === "salary" ? (
                <AddSalaryForm newSalaryValue={newSalaryValue} setNewSalaryValue={setNewSalaryValue} />
              ) : (
                <td></td>
              )}
              <td>
                <input
                  type="number"
                  placeholder="Cadence"
                  onChange={(e) => setNewLineCadenceN(Number(e.target.value))}
                />
              </td>
              <td>other</td>
              <td>
                <button onClick={handleAddLine} className={addReady ? "ready" : ""} disabled={!haslines && !addReady}>
                  {addReady || !haslines ? "Add" : "Cancel"}
                </button>
              </td>
            </tr>
            <tr className="total">
              <td>Total</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{`$${yearlyTotals.reduce((sum, total) => sum + total.yearlyTotal, 0).toFixed(2)}`}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
