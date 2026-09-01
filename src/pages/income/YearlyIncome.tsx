import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { useSetIncomeStream } from "../../state/hooks";

import "../expenses/ExpenseTable.css";
import type { Income, IncomeStream, StreamCadence } from "../../state/interface/income";
import { getMonthlyStreamTotals } from "../../state/calc/occurrences";

interface IncomeRowProps {
  stream: IncomeStream;
  adding: boolean;
  setAdding: (adding: boolean) => void;
  yearlyTotal: number;
}
function HourlyIncomeRow({ stream, adding, setAdding, yearlyTotal }: IncomeRowProps) {
  if (stream.kind !== "hourly") {
    throw new Error("HourlyIncomeRow can only be used with hourly income streams");
  }

  return (
    <tr key={stream.id} className="expense">
      <td></td>
      <td>{stream.name}</td>
      <td>${stream.hourlyRate.toFixed(2)}</td>
      <td>{stream.hoursPerPeriod} hours per pay period</td>
      <td>
        {stream.streamCadence.kind === "everyPaycheck" ? "Every Paycheck" : `Every ${stream.streamCadence.n} Days`}
      </td>
      <td>${yearlyTotal.toFixed(2)}</td>
      <td className={adding ? "hidden" : "plus"}>
        <button onClick={() => setAdding(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </td>
    </tr>
  );
}

function SalaryIncomeRow({ stream, adding, setAdding, yearlyTotal }: IncomeRowProps) {
  if (stream.kind !== "salary") {
    throw new Error("SalaryIncomeRow can only be used with salary income streams");
  }

  return (
    <tr key={stream.id} className="expense">
      <td></td>
      <td>{stream.name}</td>
      <td>${stream.annualValue.toFixed(2)}</td>
      <td></td>
      <td>
        {stream.streamCadence.kind === "everyPaycheck" ? "Every Paycheck" : `Every ${stream.streamCadence.n} Days`}
      </td>
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
  const setStream = useSetIncomeStream();
  // End store hooks

  // Computed store data
  const streamsArray = Object.values(income.streams);
  const hourlyStreams = streamsArray.filter((s) => s.kind === "hourly");
  const salaryStreams = streamsArray.filter((s) => s.kind === "salary");
  const hasStreams = streamsArray.length > 0;
  const hasSalaryStreams = salaryStreams.length > 0;
  const hasHourlyStreams = hourlyStreams.length > 0;
  const yearlyTotals = streamsArray.map((stream) => ({
    streamId: stream.id,
    yearlyTotal: getMonthlyStreamTotals(income, stream, startOfYear, endOfYear).reduce(
      (sum, month) => sum + month.total,
      0,
    ),
  }));
  // End computed store data

  // Adding stream state
  const [adding, setAdding] = useState(false);
  const [newStreamName, setNewStreamName] = useState("");
  const [newStreamKind, setNewStreamKind] = useState<"hourly" | "salary">("hourly");
  const [newStreamCadenceN, setNewStreamCadenceN] = useState(income.payPeriodDays);
  const [newHourlyRate, setNewHourlyRate] = useState(0);
  const [newHoursPerPeriod, setNewHoursPerPeriod] = useState(0);
  const [newSalaryValue, setNewSalaryValue] = useState(0);
  const addReady =
    newStreamName &&
    ((newStreamKind === "hourly" && newHourlyRate > 0 && newHoursPerPeriod > 0) ||
      (newStreamKind === "salary" && newSalaryValue > 0));
  const newStreamCadence: StreamCadence =
    newStreamCadenceN !== income.payPeriodDays
      ? { kind: "everyNDays", n: newStreamCadenceN, anchorDate: income.anchorDate }
      : { kind: "everyPaycheck" };

  const newStream: IncomeStream =
    newStreamKind === "hourly"
      ? {
          kind: "hourly",
          id: crypto.randomUUID(),
          name: newStreamName,
          hourlyRate: newHourlyRate,
          hoursPerPeriod: newHoursPerPeriod,
          streamCadence: newStreamCadence,
        }
      : {
          kind: "salary",
          id: crypto.randomUUID(),
          name: newStreamName,
          annualValue: newSalaryValue,
          streamCadence: newStreamCadence,
        };
  // End adding stream state

  // Handlers
  const handleAddStream = () => {
    if (!addReady) {
      setAdding(false);
      return;
    }

    setStream(income.id, newStream);

    setAdding(false);
    setNewStreamName("");
    setNewStreamKind("hourly");
    setNewHourlyRate(0);
    setNewHoursPerPeriod(0);
    setNewSalaryValue(0);
    setNewStreamCadenceN(income.payPeriodDays);
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
            {hasSalaryStreams && (
              <tr className="separator">
                <td>Salary Streams:</td>
                <td>Name</td>
                <td></td>
                <td></td>
                <td>Cadence</td>
                <td>Annual Value</td>
                <td className="hidden"></td>
              </tr>
            )}
            {salaryStreams.map((stream) => (
              <SalaryIncomeRow
                key={stream.id}
                stream={stream}
                adding={adding}
                setAdding={setAdding}
                yearlyTotal={yearlyTotals.find((t) => t.streamId === stream.id)?.yearlyTotal ?? 0}
              />
            ))}
            {hasHourlyStreams && (
              <tr className="separator">
                <td>Hourly Streams:</td>
                <td>Name</td>
                <td>Hourly Rate</td>
                <td>Hours per Period</td>
                <td>Cadence</td>
                <td>Amount per Year</td>
                <td className="hidden"></td>
              </tr>
            )}
            {hourlyStreams.map((stream) => (
              <HourlyIncomeRow
                key={stream.id}
                stream={stream}
                adding={adding}
                setAdding={setAdding}
                yearlyTotal={yearlyTotals.find((t) => t.streamId === stream.id)?.yearlyTotal ?? 0}
              />
            ))}
            <tr className={adding || !hasStreams ? "add" : "hidden"}>
              <td>
                <select value={newStreamKind} onChange={(e) => setNewStreamKind(e.target.value as "hourly" | "salary")}>
                  <option value="hourly">Hourly</option>
                  <option value="salary">Salary</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Stream name"
                  value={newStreamName}
                  onChange={(e) => setNewStreamName(e.target.value)}
                />
              </td>
              {newStreamKind === "hourly" ? (
                <AddHourlyForm
                  newHourlyRate={newHourlyRate}
                  setNewHourlyRate={setNewHourlyRate}
                  newHoursPerPeriod={newHoursPerPeriod}
                  setNewHoursPerPeriod={setNewHoursPerPeriod}
                />
              ) : newStreamKind === "salary" ? (
                <AddSalaryForm newSalaryValue={newSalaryValue} setNewSalaryValue={setNewSalaryValue} />
              ) : (
                <td></td>
              )}
              <td>
                <input
                  type="number"
                  placeholder="Cadence"
                  onChange={(e) => setNewStreamCadenceN(Number(e.target.value))}
                />
              </td>
              <td>other</td>
              <td>
                <button
                  onClick={handleAddStream}
                  className={addReady ? "ready" : ""}
                  disabled={!hasStreams && !addReady}
                >
                  {addReady || !hasStreams ? "Add" : "Cancel"}
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
