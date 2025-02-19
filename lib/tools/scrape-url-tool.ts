import { tool } from "ai";
import { z } from "zod";
import FirecrawlApp from "@mendable/firecrawl-js";

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
    // const crawlResponse = await app.crawlUrl(url, {
    //   limit: 100,
    //   scrapeOptions: {
    //     formats: ["markdown", "html"],
    //   },
    // });

    // if (!crawlResponse.success) {
    //   throw new Error(`Failed to crawl: ${crawlResponse.error}`);
    // }

    // console.log(crawlResponse);

    const content = `something from ${url}   <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere delectus
        est quam porro sint beatae magnam eveniet recusandae optio illum neque
        voluptas, quae sapiente sed error aspernatur iste voluptatem et.
        <ul>
          <li>homedasdas</li>
          <li>homedasdas</li>
          <li>homedasdas</li>
        </ul>
      </p>`;

    return { url, content };
  },
});
