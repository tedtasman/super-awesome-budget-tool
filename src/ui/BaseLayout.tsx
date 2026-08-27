import Sidebar from "./Sidebar";

import "./styles/BaseLayout.css";

export default function BaseLayout({
  children,
  currentPage,
  setCurrentPage,
  theme,
  toggleTheme,
}: {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  return (
    <div className="base-layout">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} theme={theme} toggleTheme={toggleTheme} />
      <div className="base-layout-right">{children}</div>
    </div>
  );
}
