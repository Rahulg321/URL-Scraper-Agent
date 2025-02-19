"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Weather } from "@/components/Weather";
import { useChat } from "@ai-sdk/react";

export default function HomePage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <h1>Hello AI</h1>
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
          <div>
            {m.toolInvocations?.map((toolInvocation) => {
              const { toolCallId, toolName, state } = toolInvocation;
              console.log("tool invocation", toolInvocation);
              if (state === "result") {
                if (toolName === "displayWeather") {
                  const { result } = toolInvocation;
                  return (
                    <div key={toolCallId}>
                      <Weather {...result} />
                    </div>
                  );
                }
              } else {
                return (
                  <div key={toolCallId}>
                    {toolName === "displayWeather" ? (
                      <div>Loading weather...</div>
                    ) : null}
                    {toolName === "displayWeather" ? (
                      <div>Loading weather...</div>
                    ) : null}
                    {toolName === "displayWeather" ? (
                      <div>Loading weather...</div>
                    ) : null}
                    {toolName === "displayWeather" ? (
                      <div>Loading weather...</div>
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <Input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
