import { useState } from "react";
import { useSetTaxRoute, useTaxRoutes } from "../../state/hooks";
import ModalOverlay from "../../ui/ModalOverlay";
import PageCore from "../../ui/PageCore";
import RouteTable from "./RouteTable";

export default function Taxes() {
  const taxRoutes = useTaxRoutes();
  const taxRoutesArray = Object.values(taxRoutes);
  const setTaxRoute = useSetTaxRoute();

  const [addingRoute, setAddingRoute] = useState(false);

  const [newRouteName, setNewRouteName] = useState("");
  const [newRouteBrackets, setNewRouteBrackets] = useState<{ lowerBound: number; rate: number }[]>([
    { lowerBound: 0, rate: 0 },
  ]);

  const handleAddRoute = () => {
    const newRouteId = crypto.randomUUID();
    setTaxRoute({
      id: newRouteId,
      name: newRouteName,
      brackets: newRouteBrackets,
    });
    setNewRouteName("");
    setNewRouteBrackets([{ lowerBound: 0, rate: 0 }]);
    setAddingRoute(false);
  };

  return (
    <PageCore pageTitle="Taxes" className="taxes">
      <ModalOverlay isOpen={addingRoute} onClose={() => setAddingRoute(false)}>
        <h2>Add New Tax Route</h2>
        <input
          type="text"
          placeholder="Route Name"
          value={newRouteName}
          onChange={(e) => setNewRouteName(e.target.value)}
        />
        <h3>Brackets</h3>
        <table>
          {newRouteBrackets.length === 1 ? (
            <>
              <thead>
                <tr>
                  <th>Flat Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr key={-1}>
                  <td>
                    <input
                      type="number"
                      placeholder="Percentage Rate"
                      value={newRouteBrackets[0].rate * 100}
                      onChange={(e) => {
                        const updatedBrackets = [...newRouteBrackets];
                        updatedBrackets[0].rate = parseFloat(e.target.value) / 100; // Convert percentage to decimal
                        setNewRouteBrackets(updatedBrackets);
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </>
          ) : (
            <>
              <thead>
                <tr>
                  <th>Lower Bound</th>
                  <th>Upper Bound</th>
                  <th>Rate</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {newRouteBrackets.map((bracket, index) => (
                  <tr key={index} className="bracket-input">
                    <td>
                      <input
                        type="number"
                        placeholder="Lower Bound"
                        value={bracket.lowerBound}
                        onChange={(e) => {
                          const updatedBrackets = [...newRouteBrackets];
                          updatedBrackets[index].lowerBound = parseFloat(e.target.value);
                          setNewRouteBrackets(updatedBrackets);
                        }}
                      />
                    </td>
                    <td>{index < newRouteBrackets.length - 1 ? newRouteBrackets.at(index + 1)?.lowerBound : "∞"}</td>
                    <td>
                      <input
                        type="number"
                        placeholder="Rate"
                        value={bracket.rate * 100}
                        onChange={(e) => {
                          const updatedBrackets = [...newRouteBrackets];
                          updatedBrackets[index].rate = parseFloat(e.target.value) / 100; // Convert percentage to decimal
                          setNewRouteBrackets(updatedBrackets);
                        }}
                      />
                    </td>
                    <td>
                      {index === newRouteBrackets.length - 1 && (
                        <button
                          onClick={() => {
                            const updatedBrackets = newRouteBrackets.filter((_, i) => i !== index);
                            setNewRouteBrackets(updatedBrackets);
                          }}
                        >
                          Remove Bracket
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
        <button
          onClick={() =>
            setNewRouteBrackets([
              ...newRouteBrackets,
              {
                lowerBound:
                  newRouteBrackets.length === 0 ? 0 : newRouteBrackets[newRouteBrackets.length - 1].lowerBound + 1,
                rate: 0,
              },
            ])
          }
        >
          Add Bracket
        </button>
        <button onClick={handleAddRoute}>Add Route</button>
      </ModalOverlay>
      {taxRoutesArray.map((route) => (
        <div key={route.id} className="tax-route">
          <h2>{route.name}</h2>
          <RouteTable route={route} />
        </div>
      ))}
      <button onClick={() => setAddingRoute(true)}>Add Tax Route</button>
    </PageCore>
  );
}
