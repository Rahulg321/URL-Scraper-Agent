"use client";

import { useChat } from "@ai-sdk/react";
import { Loader, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Weather } from "@/components/Weather";
import { useState } from "react";
import ChatSheetEditor from "@/components/chat-sheet-editor";

export default function HomePage() {
  const [isStopping, setIsStopping] = useState(false);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    stop,
  } = useChat();

  const handleStop = async () => {
    setIsStopping(true);
    try {
      await stop();
    } catch (error) {
      console.error("Failed to stop generation:", error);
    } finally {
      setIsStopping(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto min-h-screen p-4">
      <div className="flex-1 space-y-6 pb-20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 items-start",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <Avatar className="">
                <AvatarImage src="/bot-avatar.png" alt="AI Assistant" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn(
                "rounded-lg px-4 py-2 max-w-[85%] sm:max-w-[75%]",
                message.role === "user" ? "bg-primary text-white" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "prose dark:prose-invert prose-sm sm:prose-base max-w-none",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : ""
                )}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>

              {message.toolInvocations?.map((toolInvocation) => {
                const { toolCallId, toolName, state } = toolInvocation;

                if (state === "result") {
                  if (toolName === "displayWeather") {
                    const { result } = toolInvocation;
                    console.log("Weather tool Result", result);
                    return (
                      <div key={toolCallId} className="mt-3">
                        <Weather {...result} />
                      </div>
                    );
                  }

                  if (toolName === "scrapeUrlTool") {
                    const { result } = toolInvocation;
                    console.log("Result", result);
                    const items = result.items;
                    console.log("items", items);
                    return (
                      <div key={toolCallId} className="mt-3">
                        presenting tabular data
                        <ChatSheetEditor data={items} />
                      </div>
                    );
                  }

                  if (toolName === "extractListingsFromUrl") {
                    const { result } = toolInvocation;
                    const items = result.items;
                    console.log("listing items from url", items);
                    return (
                      <div key={toolCallId} className="mt-3">
                        presenting tabular data
                        <ChatSheetEditor data={items} />
                      </div>
                    );
                  }
                  return null;
                }

                return (
                  <div
                    key={toolCallId}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Loader className="h-4 w-4 animate-spin" />
                    {toolName === "displayWeather" &&
                      "Fetching weather data..."}
                    {toolName === "scrapeUrlTool" &&
                      "Scraping content from URL..."}
                    {toolName === "inferMarkdownContentTool" &&
                      "Processing markdown content..."}
                  </div>
                );
              })}
            </div>

            {message.role === "user" && (
              <Avatar className="">
                <AvatarImage src="/user-avatar.png" alt="User" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-start">
            <Avatar className="h-8 w-8">
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg px-4 py-2 max-w-[85%] sm:max-w-[75%]">
              <div className="flex gap-2 items-center text-muted-foreground">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto p-4 flex gap-2 items-center"
        >
          <Input
            className="flex-1"
            value={input}
            placeholder="Type your message..."
            // onKeyDown={async (event) => {
            //   if (event.key === "Enter") {
            //     append({ content: input, role: "user" });
            //   }
            // }}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          {isLoading ? (
            <Button
              type="button"
              variant="destructive"
              onClick={handleStop}
              disabled={isStopping}
              className="gap-2"
            >
              {isStopping ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Stopping
                </>
              ) : (
                <>
                  <Square className="h-4 w-4" />
                  Stop
                </>
              )}
            </Button>
          ) : (
            <Button type="submit" disabled={!input.trim()}>
              Send
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
