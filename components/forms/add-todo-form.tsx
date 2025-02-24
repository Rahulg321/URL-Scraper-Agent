"use client";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  contactFormSchema,
  ContactFormValues,
} from "@/lib/schemas/contact-schema";
import { todoFormSchema, TodoFormValues } from "@/lib/schemas/todo-schema";
import { addTodo } from "@/lib/actions/add-todo";
import { useTransition } from "react";

export default function AddTodoForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      text: "",
      done: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: TodoFormValues) {
    startTransition(async () => {
      try {
        console.log(values);
        const response = await addTodo(values);
        if (response.success) {
          toast.success(response.success);
          form.reset();
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{isPending ? "adding" : "Add Todo"}</Button>
      </form>
    </Form>
  );
}
