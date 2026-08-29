import { Link } from "react-router-dom";

import { pages } from "../constants/pages";

import "./styles/Sidebar.css";

export default function Sidebar({
  currentPage,
  theme,
  toggleTheme,
}: {
  currentPage: string;
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  return (
    <div className="sb">
      <div className="top">
        <Link to="/">Home</Link>
      </div>
      <div className="bottom">
        <div className="pages">
          {pages.map((page) => (
            <Link key={page.name} to={page.path} className={`link ${page.path === currentPage ? "active" : ""}`}>
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
