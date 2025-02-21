import { tool } from "ai";
import { z } from "zod";
import InferMarkdownRawContent from "../actions/infer-markdown";
import InferRawJson from "../actions/infer-raw-json";

// the `tool` helper function ensures correct type inference:
export const inferMarkdownContentTool = tool({
  description:
    "infer valuable content from the rough markdown file, extract as much valuable information as u can and present it in a structured way",
  parameters: z.object({
    url: z.string().describe("The url to scrape content from"),
    // markdown: z
    //   .string()
    //   .describe(
    //     "The scraped content from the url, can include markdown or html format and plain text format"
    //   ),
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

    console.log("content Recieved in infer", content);

    const valuableContent = await InferRawJson(content);
    console.log(
      "valuable content inferred from AI server action",
      valuableContent
    );

    return { valuableContent };
  },
});
