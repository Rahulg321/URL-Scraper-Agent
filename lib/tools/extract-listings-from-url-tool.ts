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
export const extractListingsFromUrl = tool({
  description:
    "Use this tool when the user wants to extract listings from a url by scraping. This tool will scrape the content from the provided URL and extract the listings from the page...",
  parameters: z.object({
    url: z.string().describe("The url to scrape content from"),
  }),
  execute: async ({ url }) => {
    if (!url) {
      throw new Error("URL is required, could not find url");
    }

    console.log("extracting listings from this url using the tool", url);

    const userPrompt = `
      Extract all valuable and useful content from the page
    `;
    const systemPrompt = `
      You are an helpful AI Assistant that extracts structured data from a webpage.
    `;

    const schema = z.array(
      z.object({
        type: z.literal("listing"),
        title: z.string(),
        description: z.string(),
        state: z.string(),
        category: z.string(),
        revenue: z.string(),
        listingCode: z.string(),
        underContract: z.string(),
        askingPrice: z.string(),
        minimumEbitda: z.string(),
        maximumEbitda: z.string(),
        ebitda: z.string(),
        price: z.string(),
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

    // @ts-ignore
    const items = crawlResponse.json.items;
    console.log("extract listings crawl response items", items);

    return { items };
  },
});

/**
 * crawl response succedded [
  {
    type: 'founder',
    firstName: 'Tom',
    lastName: 'Pfennig',
    designation: 'Founder & CEO',
    linkedInUrl: 'https://www.linkedin.com/in/thomas-pfennig-7750b518/',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'founder',
    firstName: 'Dr. Vera',
    lastName: 'Roedel',
    designation: 'Co-Founder & Partnership Officer',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'founder',
    firstName: 'Dr. Sunu',
    lastName: 'Engineer',
    designation: 'Co-Founder & Technology Officer',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'team',
    firstName: 'Mel',
    lastName: 'Nirmala',
    designation: 'Corporate Director - Singapore Branch',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'team',
    firstName: 'Dr. Ilona',
    lastName: 'Murati-Laebe',
    designation: 'Legal & Compliance Transformation Expert (EMEA | APAX)',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'team',
    firstName: 'Gustavo',
    lastName: 'Siqueira',
    designation: 'Legal & Compliance Transformation Expert (AMERICAS)',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'team',
    firstName: 'Swati',
    lastName: 'Thounaojam',
    designation: 'R&D, Data and Market Analytics (INDIA)',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'team',
    firstName: 'Tadala',
    lastName: 'Chinkwezule',
    designation: 'Legal & Compliance Transformation Expert (AFRICA)',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'team',
    firstName: 'Larry',
    lastName: 'Platkin',
    designation: 'Legal & Compliance Transformation Expert (USA | CANADA)',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'team',
    firstName: 'Piyush',
    lastName: 'Rajput',
    designation: 'LegalTech Software Testing Expert (INDIA)',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'team',
    firstName: 'Gaijatri',
    lastName: 'Gupta',
    designation: 'LegalTech UX Specialist Lawyer (INDIA)',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'team',
    firstName: 'Adarsh',
    lastName: 'Tatiya',
    designation: 'Director Legal Technology and Operations',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'team',
    firstName: 'Alan',
    lastName: 'Gibson',
    designation: 'Senior Technical Advisor Digital Innovation Lead (USA | Canada)',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'team',
    firstName: 'Priyanka',
    lastName: 'Ahire',
    designation: 'Development and Operations Test Environment and Directory (INDIA)',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  },
  {
    type: 'team',
    firstName: 'Yunna',
    lastName: 'Choi',
    designation: 'Digital UX and UI Interface. Expert',
    linkedInUrl: '',
    detailPageUrl: 'https://transforming.legal/contact'
  }
]
 */
