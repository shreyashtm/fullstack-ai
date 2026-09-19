// Concept: js.modules (Understand)
//
// Wires state.js + storage.js + totals.js + sync.js + ui.js together.
// This file should stay thin — orchestration only, no business logic of
// its own.

import { setExpenses, getExpenses, addExpense, removeExpense } from "./state.js";
import { loadExpenses, saveExpenses } from "./storage.js";
import { createCategoryTotalTracker } from "./totals.js";
import { syncExpenseAndLog } from "./sync.js";
import { renderTotals, renderExpenseList, bindExpenseForm } from "./ui.js";

// TODO:
// 1. load persisted expenses into state on startup
// 2. create the totals tracker, recompute it, render both lists
// 3. bindExpenseForm: on add -> update state -> save -> re-render -> syncExpenseAndLog
// 4. wire delete similarly (update state -> save -> re-render)
