import Sidebar from "./Sidebar";

import "../../styles/ui/BaseLayout.css";
import Header from "./Header";

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
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <div className="base-layout-right">
        <Header
          pageTitle={currentPage}
          actions={<>hello this is an action</>}
          tabs={<>hello this is a tab</>}
        />
        <div className="base-layout-content">{children}</div>
      </div>
    </div>
  );
}
