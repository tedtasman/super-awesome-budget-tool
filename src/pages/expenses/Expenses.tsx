import { useState } from "react";
import IntervalSelector from "../../ui/IntervalSelector";
import PageCore from "../../ui/PageCore";
import { useCategories, useExpenses, useSetCategory } from "../../state/hooks";
import Category from "./Category";
import type { Expense } from "../../state/interface/expense";
import ModalOverlay from "../../ui/ModalOverlay";

export default function Expenses() {
  // ====== Store hooks ========
  const expenses = useExpenses();
  const categories = useCategories();
  const setCategory = useSetCategory();
  // ====== End store hooks ========

  // ====== Computed data ========
  const categoryArray = Object.keys(categories);
  const expensesArray = Object.values(expenses);
  const expensesByCategory: Record<string, Record<string, Expense>> = expensesArray.reduce(
    (acc, expense) => {
      acc[expense.categoryId][expense.id] = expense;
      return acc;
    },
    Object.fromEntries(categoryArray.map((categoryId) => [categoryId, {}])) as Record<string, Record<string, Expense>>,
  );
  // ====== End computed data ========

  // ====== Display State ========
  const [interval, setInterval] = useState<"week" | "month" | "year" | number>("month");
  const [activeCategoryId, setActiveCategoryId] = useState(Object.keys(expensesByCategory)[0] || "");
  // ====== End display state ========

  // ====== Adding category state ========
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  // ====== End adding category state ========

  // ====== Handlers ========
  const handleAddCategory = () => {
    const newCategoryId = crypto.randomUUID();
    setCategory({
      id: newCategoryId,
      name: newCategoryName,
    });
    setNewCategoryName("");
    setActiveCategoryId(newCategoryId);
    setAddingCategory(false);
  };

  return (
    <PageCore
      pageTitle="Expenses"
      className=""
      tabs={[
        ...categoryArray.map((categoryId) => (
          <button key={categoryId} className="tab" onClick={() => setActiveCategoryId(categoryId)}>
            {categories[categoryId].name}
          </button>
        )),
        <button key="add-category" onClick={() => setAddingCategory(true)}>
          Add Category
        </button>,
      ]}
      actions={<IntervalSelector interval={interval} setInterval={setInterval} />}
    >
      {/* Add category modal */}
      <ModalOverlay isOpen={addingCategory} onClose={() => setAddingCategory(false)}>
        <h2>Add New Category</h2>
        <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
        <button onClick={handleAddCategory}>Add Category</button>
      </ModalOverlay>
      {/* End add category modal */}

      {/* Render active category */}
      {activeCategoryId ? (
        <Category
          key={activeCategoryId}
          interval={interval}
          expenses={expensesByCategory[activeCategoryId]}
          categoryId={activeCategoryId}
        />
      ) : (
        <>
          <h2>No categories available</h2>
          <p>Please add a category to get started.</p>
          <button onClick={() => setAddingCategory(true)}>Add Category</button>
        </>
      )}
      {/* End render categories */}
    </PageCore>
  );
}
