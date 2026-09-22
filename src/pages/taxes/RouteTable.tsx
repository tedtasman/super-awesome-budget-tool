import { useTaxOwedForRoute } from "../../state/hooks";
import type { TaxRoute } from "../../state/interface/taxRoute";

interface BracketTableProps {
  route: TaxRoute;
}

export default function RouteTable({ route }: BracketTableProps) {
  const taxOwedForRoute = useTaxOwedForRoute(route.id);

  return (
    <table className="expense-table">
      <thead className="header">
        <tr>
          <th>Lower Bound</th>
          <th>Upper Bound</th>
          <th>Rate</th>
        </tr>
      </thead>
      <tbody className="body">
        {route.brackets.map((bracket, index) => (
          <tr key={index} className="expense">
            <td>{`$${bracket.lowerBound.toFixed(2)}`}</td>
            <td>{`$${route.brackets.at(index + 1)?.lowerBound.toFixed(2) ?? "∞"}`}</td>
            <td>{`${bracket.rate * 100}%`}</td>
          </tr>
        ))}
        <tr>
          <td>
            <strong>Total Owed</strong>
          </td>
          <td colSpan={2}>{taxOwedForRoute.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  );
}
