import { z } from "zod";

export const todoFormSchema = z.object({
  text: z.string().min(2, "Todo must be at least 2 characters"),
  done: z.boolean().default(false),
});

export type TodoFormValues = z.infer<typeof todoFormSchema>;
