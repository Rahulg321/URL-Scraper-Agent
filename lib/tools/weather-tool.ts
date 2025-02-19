import { tool } from "ai";
import { z } from "zod";

// the `tool` helper function ensures correct type inference:
export const displayWeather = tool({
  description: "Get the weather in a location",
  parameters: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async ({ location }) => {
    console.log("Getting weather for", location);
    const temperature = 72 + Math.floor(Math.random() * 21) - 10;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("got it");
    return { weather: "Sunny", temperature, location };
  },
});
