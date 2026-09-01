import Breakdown from "../pages/Breakdown";
import Budget from "../pages/Budget";
import Expenses from "../pages/expenses/Expenses";
import Income from "../pages/income/Income";
import Taxes from "../pages/Taxes";

export const pages = [
  { name: "Budget", path: "/budget", component: Budget },
  { name: "Breakdown", path: "/breakdown", component: Breakdown },
  { name: "Income", path: "/income", component: Income },
  { name: "Expenses", path: "/expenses", component: Expenses },
  { name: "Taxes", path: "/taxes", component: Taxes },
];
