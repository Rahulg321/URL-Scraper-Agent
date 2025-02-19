import { tool } from "ai";
import { z } from "zod";

// the `tool` helper function ensures correct type inference:
export const inferMarkdownContentTool = tool({
  description:
    "infer valuable content from the rough markdown file, extract as much valuable information as u can and present it in a structured way",
  parameters: z.object({
    markdown: z.string().describe("The url to scrape content from"),
  }),
  execute: async ({ markdown }) => {
    if (!markdown) {
      throw new Error("MARKDOWN is required, could not find url");
    }

    console.log("Markdown Recieved", markdown);

    const valuableContent = [
      {
        type: "text",
        content: "Hello World",
      },
      {
        type: "image",
        content: "https://example.com/image.png",
      },
      {
        type: "team",
        name: "Juliaane Hough",
        designation: "Dancer",
      },
    ];

    return { markdown, valuableContent };
  },
});
