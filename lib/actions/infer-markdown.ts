"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { MARKDOWN_DATA_TYPE } from "../types";
import { DataUnionSchema } from "../schemas/data-union";

// 1. Create your OpenAI instance
const openai = createOpenAI({
  apiKey: process.env.AI_API_KEY,
});

// 5. Main function that calls the LLM to parse the markdown
export default async function InferMarkdownRawContent(
  rawMarkdownContent: string
  // dataType: MARKDOWN_DATA_TYPE
) {
  try {
    console.log("Inferring Markdown Content inside server action...");

    // System prompt (high-level instructions to the LLM)
    const systemPrompt = `
      You are a helpful AI that extracts structured data from markdown content.
      You will produce a JSON array of objects, where each object can be either:

      1) A team object:
        {
          "type": "team",
          "firstName": string,
          "lastName": string,
          "designation"?: string,
          "linkedInUrl"?: string,
          "detailPageUrl"?: string
        }

      2) A listing object:
        {
          "type": "listing",
          "title": string,
          "description": string,
          "state": string,
          "category": string,
          "revenue": string,
          "listingCode": string,
          "underContract": string,
          "askingPrice": string,
          "minimumEbitda": string,
          "maximumEbitda": string,
          "ebitda": string,
          "price": string
        }

      Return only valid JSON in your response. No extra text or keys. If a field is absent, return null.
    `;

    // User prompt (where you provide the actual markdown plus any direct instructions)
    const userPrompt = `
      The user has provided the following json content:
      ---
      ${rawMarkdownContent}
      ---
      Please parse it into an array of either team objects or listing objects,
      depending on which is more relevant and is provided by the json.
      If multiple items are mentioned, return multiple objects in the array. Also if some fields are absent then just return null.
    `;

    // 6. Call generateObject with the union-based array schema
    const { object } = await generateObject({
      model: openai("gpt-4"),
      schema: DataUnionSchema,
      maxTokens: 8000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      // Or you could do prompt: "..." if you prefer the older usage
    });

    // object is guaranteed to be an array of either "team" or "listing" shapes
    return object;
  } catch (error) {
    console.error("error inside infer markdown raw content", error);
    throw error;
  }
}
