import { addDealToDatabase } from "@/lib/tools/add-deal-db";
import { extractListingsFromUrl } from "@/lib/tools/extract-listings-from-url-tool";
import { inferJSONContentTool } from "@/lib/tools/infer-content-tool";
import { scrapeUrlTool } from "@/lib/tools/scrape-url-tool";
import { displayWeather } from "@/lib/tools/weather-tool";
import { createOpenAI } from "@ai-sdk/openai";
import {
  InvalidToolArgumentsError,
  NoSuchToolError,
  streamText,
  tool,
  ToolExecutionError,
} from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openai = createOpenAI({
  apiKey: process.env.AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai("gpt-4o"),
      system: "You are a friendly assistant.",
      messages,
      maxSteps: 6,
      tools: {
        displayWeather,
        scrapeUrlTool,
        inferJSONContentTool,
        extractListingsFromUrl,
        addDealToDatabase,
      },
      // onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
      //   // your own logic, e.g. for saving the chat history or recording usage
      //   console.log("step finished");
      //   console.log("text", text);
      //   console.log("toolCalls", toolCalls);
      //   console.log("toolResults", toolResults);
      //   console.log("finishReason", finishReason);
      //   console.log("usage", usage);
      // },
    });

    // extract all tool calls from the steps:
    // const steps = await result.steps;
    // const allToolCalls = steps.flatMap((step) => step.toolCalls);

    // console.log("all tool calls", allToolCalls);
    // console.log("all steps", steps);

    return result.toDataStreamResponse({
      getErrorMessage(error) {
        if (NoSuchToolError.isInstance(error)) {
          return "The model tried to call a unknown tool.";
        } else if (InvalidToolArgumentsError.isInstance(error)) {
          return "The model called a tool with invalid arguments.";
        } else if (ToolExecutionError.isInstance(error)) {
          return "An error occurred during tool execution.";
        } else {
          return "An unknown error occurred.";
        }
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
