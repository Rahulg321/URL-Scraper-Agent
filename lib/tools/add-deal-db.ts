import { tool } from "ai";
import { z } from "zod";

// I have a deal by the name of "RUpa Mistri Street " with location India, revenue:2000000, ebitda:$2132112, industry:"HEALTHCARE"

// the `tool` helper function ensures correct type inference:
export const addDealToDatabase = tool({
  description:
    "Add a deal to the database. Use this tool whenever you need to add a deal to the database.",
  parameters: z.object({
    title: z.string().describe("The title of the deal."),
    industry: z.string().describe("The title of the deal."),
    ebitda: z.string().describe("The title of the deal."),
    revenue: z.string().optional().describe("The title of the deal."),
  }),
  execute: async ({ title, industry, ebitda, revenue }) => {
    console.log(
      "adding deal to the database",
      title,
      industry,
      ebitda,
      revenue
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return { title };
  },
});
