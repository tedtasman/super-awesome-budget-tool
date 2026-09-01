import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

import "./styles/BaseLayout.css";

export default function BaseLayout({
  children,
  theme,
  toggleTheme,
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const location = useLocation();
  const currentPage = location.pathname;
  return (
    <div className="base-layout">
      <Sidebar currentPage={currentPage} theme={theme} toggleTheme={toggleTheme} />
      <div className="base-layout-right">{children}</div>
    </div>
  );
}
