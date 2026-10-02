import type { ToolDefinition, ToolResult } from "./tool.js";

export type AIInput =
  | {
      type: "text";
      content: string;
    }
  | {
      type: "tool_result";
      result: ToolResult;
    };

export type AIRequest = {
  input: string | AIInput[];
  tools?: ToolDefinition[];
};

export type AIToolCall = {
  id: string;
  toolId: string;
  arguments: unknown;
};

export type AITextResponse = {
  type: "text";
  content: string;
};

export type AIToolCallResponse = {
  type: "tool_call";
  toolCall: AIToolCall;
};

export type AIResponse =
  | AITextResponse
  | AIToolCallResponse;
