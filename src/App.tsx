import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import BaseLayout from "./ui/BaseLayout";
import Home from "./pages/Home";
import { pages } from "./constants/pages";

import "./App.css";

function App() {
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
      <BaseLayout theme={theme} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<Home />} />
          {pages.map((page) => (
            <Route key={page.name} path={page.path} element={<page.component />} />
          ))}
        </Routes>
      </BaseLayout>
    </Router>
  );
}

export default App;
