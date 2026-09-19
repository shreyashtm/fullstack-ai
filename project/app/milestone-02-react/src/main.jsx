import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ExpensesProvider } from "./state/ExpensesContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ExpensesProvider>
      <App />
    </ExpensesProvider>
  </React.StrictMode>
);
