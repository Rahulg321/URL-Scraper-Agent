import { tool } from "ai";
import { z } from "zod";
import InferRawJson from "../actions/infer-raw-json";

// the `tool` helper function ensures correct type inference:
export const inferJSONContentTool = tool({
  description:
    "Infer content from the provided JSON. If the situation requires inferring structured content from a raw JSON string then use this tool.",
  parameters: z.object({
    url: z.string().describe("The url to scrape content from"),
    content: z
      .string()
      .describe(
        "The stringified JSON object returned from scraping the URL that contains all the relevant information from fetched url"
      ),
  }),
  execute: async ({ content, url }) => {
    if (!content) {
      throw new Error("content is required, could not find url");
    }

    console.log("content Recieved in infer tool", content);

    const valuableContent = await InferRawJson(content);

    console.log(
      "valuable content inferred from AI server action",
      valuableContent
    );

    return { valuableContent };
  },
});
