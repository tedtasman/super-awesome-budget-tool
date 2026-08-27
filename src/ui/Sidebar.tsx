import { Link } from "react-router-dom";

import "./styles/Sidebar.css";

export default function Sidebar({
  currentPage,
  setCurrentPage,
  theme,
  toggleTheme,
}: {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const pages = [
    { name: "Budget", path: "/budget" },
    { name: "Breakdown", path: "/breakdown" },
    { name: "Necessities", path: "/necessities" },
    { name: "Savings", path: "/savings" },
    { name: "Misc", path: "/misc" },
    { name: "Taxes", path: "/taxes" },
  ];

  return (
    <div className="sb">
      <div className="top">
        <Link to="/" onClick={() => setCurrentPage("home")}>
          Home
        </Link>
      </div>
      <div className="bottom">
        <div className="pages">
          {pages.map((page) => (
            <Link
              key={page.name}
              to={page.path}
              onClick={() => setCurrentPage(page.name)}
              className={`link ${page.name === currentPage ? "active" : ""}`}
            >
              {page.name}
            </Link>
          ))}
        </div>
        <div className="footer">
          this is where the footer would be
          <button type="button" onClick={toggleTheme} aria-pressed={theme === "dark"}>
            {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          </button>
        </div>
      </div>
    </div>
  );
}
