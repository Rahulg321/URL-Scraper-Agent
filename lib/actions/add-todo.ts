"use server";

import { revalidatePath } from "next/cache";
import { contactFormSchema } from "../schemas/contact-schema";
import { todoFormSchema, TodoFormValues } from "../schemas/todo-schema";
import { db } from "../db/drizzle";
import { todo } from "../db/schema";

export async function addTodo(values: TodoFormValues) {
  try {
    const validated = todoFormSchema.safeParse(values);

    if (!validated.success) {
      return { error: "Invalid form data" };
    }

    await db.insert(todo).values({
      text: validated.data.text,
    });

    revalidatePath("/todos");
    // Here you would typically send this to your database or email service
    console.log("Form submitted:", validated.data);

    return { success: "Message sent successfully!" };
  } catch (error) {
    console.log("Error adding todo:", error);
    throw error;
  }
}
