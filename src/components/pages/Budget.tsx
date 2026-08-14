import { useNavigate } from "react-router-dom";
import "../../styles/pages/Budget.css";

export default function Budget() {
  const navigate = useNavigate();

  return (
    <div className="budget">
      <table className="categories">
        <thead className="info">
          <tr>
            <th>Category</th>
            <th>Allocation</th>
            <th>Budgeted</th>
            <th>Margin</th>
          </tr>
        </thead>
        <tbody>
          <tr
            className="category"
            role="link"
            tabIndex={0}
            onClick={() => navigate("/necessities")}
          >
            <td className="title">
              <h5>Necessities</h5>
            </td>
            <td className="stage">
              <div></div>
              <h5 className="negative">-12.0%</h5>
              <span>$345.00</span>
            </td>
            <td className="stage">
              <div></div>
              <h5>45.0%</h5>
              <span>$456.00</span>
            </td>
            <td className="stage">
              <div></div>
              <h5>78.0%</h5>
              <span>$789.00</span>
            </td>
          </tr>
          <tr
            className="category"
            role="link"
            tabIndex={0}
            onClick={() => navigate("/savings")}
          >
            <td className="title">
              <h5>Savings</h5>
            </td>
            <td className="stage">
              <div></div>
              <h5>12.0%</h5>
              <span>$345.00</span>
            </td>
            <td className="stage">
              <div></div>
              <h5 className="happy">45.0%</h5>
              <span>$456.00</span>
            </td>
            <td className="stage">
              <div></div>
              <h5>78.0%</h5>
              <span>$789.00</span>
            </td>
          </tr>
          <tr
            className="category"
            role="link"
            tabIndex={0}
            onClick={() => navigate("/misc")}
          >
            <td className="title">
              <h5>Misc</h5>
            </td>
            <td className="stage">
              <div></div>
              <h5>12.0%</h5>
              <span>$345.00</span>
            </td>
            <td className="stage">
              <div></div>
              <h5>45.0%</h5>
              <span>$456.00</span>
            </td>
            <td className="stage">
              <div></div>
              <h5>78.0%</h5>
              <span>$789.00</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
