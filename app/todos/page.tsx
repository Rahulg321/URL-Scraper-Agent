import AddTodoForm from "@/components/forms/add-todo-form";
import { db } from "@/lib/db/drizzle";
import { getData } from "@/lib/db/queries";
import { todo } from "@/lib/db/schema";
import React from "react";

const TodosPage = async () => {
  const todos = await db.select().from(todo);
  return (
    <div className="space-y-4 narrow-container block-space">
      <h2>TodosPage</h2>
      <AddTodoForm />
      {todos.map((e) => {
        return (
          <div key={e.id}>
            <h2>{e.text}</h2>
          </div>
        );
      })}
    </div>
  );
};

export default TodosPage;
