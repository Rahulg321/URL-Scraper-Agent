import { tool } from "ai";
import { z } from "zod";
import FirecrawlApp from "@mendable/firecrawl-js";

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// the `tool` helper function ensures correct type inference:
export const scrapeMultipleURLSTool = tool({
  description:
    "Scrape all content from the provided URL. If the content is valuable then extract it and return it in a structured way. If the situation requires getting content from a webpage then use this tool",
  parameters: z.object({
    url: z.string().describe("The url to scrape content from"),
  }),
  execute: async ({ url }) => {
    if (!url) {
      throw new Error("URL is required, could not find url");
    }

    console.log("Getting content for", url);

    const userPrompt = `
      Extract all valuable and useful content from the page
    `;
    const systemPrompt = `
      You are an helpful AI Assistant that extracts structured data from a webpage.
    `;

    // const crawlResponse = await app.extract([url], {
    //   systemPrompt,
    //   prompt: userPrompt,
    // });

    // Define schema to extract contents into
    const schema = z.array(
      z.object({
        type: z.literal("team"),
        firstName: z.string(),
        lastName: z.string(),
        designation: z.string().optional(),
        linkedInUrl: z.string().optional(),
        detailPageUrl: z.string().optional(),
      })
    );
    const crawlResponse = await app.scrapeUrl(url, {
      formats: ["json"],
      jsonOptions: { schema: schema },
    });

    if (!crawlResponse.success) {
      console.log("crawlResponse failed", crawlResponse.error);
      throw new Error(`Failed to crawl and extract: ${crawlResponse.error}`);
    }

    console.log("crawl response succedded", crawlResponse.json);
    // const content = JSON.stringify(crawlResponse);
    // console.log("************************************************");
    // console.log("Markdown extracted => ", crawlResponse);
    // console.log("************************************************");

    return { url, crawlReponse: crawlResponse.json };
  },
});
