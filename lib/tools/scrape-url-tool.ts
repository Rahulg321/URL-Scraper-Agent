import { tool } from "ai";
import { z } from "zod";
import FirecrawlApp from "@mendable/firecrawl-js";
import {
  DataUnionSchema,
  multipleTeamMemberSchema,
  singleListingSchema,
  singleTeamMemberSchema,
} from "../schemas/data-union";

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// the `tool` helper function ensures correct type inference:
export const scrapeUrlTool = tool({
  description: "Get the scraped content of a URL",
  parameters: z.object({
    url: z.string().describe("The url to scrape content from"),
  }),
  execute: async ({ url }) => {
    if (!url) {
      throw new Error("URL is required, could not find url");
    }

    console.log("Getting content for", url);
    // System prompt (high-level instructions to the LLM)
    // const systemPrompt = `
    //   You are a helpful AI that extracts structured data from markdown content.
    //   You will produce a JSON array of objects, where each object can be either:

    //   1) A team object:
    //     {
    //       "type": "team",
    //       "firstName": string,
    //       "lastName": string,
    //       "designation"?: string,
    //       "linkedInUrl"?: string,
    //       "detailPageUrl"?: string
    //     }

    //   2) A listing object:
    //     {
    //       "type": "listing",
    //       "title": string,
    //       "description": string,
    //       "state": string,
    //       "category": string,
    //       "revenue": string,
    //       "listingCode": string,
    //       "underContract": string,
    //       "askingPrice": string,
    //       "minimumEbitda": string,
    //       "maximumEbitda": string,
    //       "ebitda": string,
    //       "price": string
    //     }

    //   Return only valid JSON in your response. No extra text or keys. If a field is absent, return null.
    // `;

    const userPrompt = `
      Extract all valuable and useful content from the page. If the content
    `;
    const systemPrompt = `
      You are an helpful AI Assistant that extracts structured data from a webpage.
    `;

    const crawlResponse = await app.extract([url], {
      // schema: multipleTeamMemberSchema,
      // schema: singleTeamMemberSchema,
      systemPrompt,
      prompt: userPrompt,
    });

    const content = JSON.stringify(crawlResponse);

    if (!crawlResponse.success) {
      throw new Error(`Failed to crawl and extract: ${crawlResponse.error}`);
    }

    // console.log("************************************************");
    // console.log("Markdown extracted => ", crawlResponse);
    // console.log("************************************************");

    return { url, crawlResponse, content };
  },
});
