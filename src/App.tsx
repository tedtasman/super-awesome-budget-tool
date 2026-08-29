import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

import BaseLayout from "./ui/BaseLayout";
import Home from "./pages/Home";
import Budget from "./pages/Budget";
import Breakdown from "./pages/Breakdown";
import Taxes from "./pages/Taxes";

function App() {
  const [currentPage, setCurrentPage] = React.useState("home");
  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    const savedTheme = window.localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <Router basename="/">
      <BaseLayout currentPage={currentPage} setCurrentPage={setCurrentPage} theme={theme} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/breakdown" element={<Breakdown />} />
          <Route path="/taxes" element={<Taxes />} />
        </Routes>
      </BaseLayout>
    </Router>
  );
}

export default App;
