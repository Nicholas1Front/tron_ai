import type { UserIdentity } from "./agent.js";

export type JsonSchema = Record<string, unknown>;

export type ToolDefinition = {
  id: string;
  name: string;
  description: string;
  inputSchema: JsonSchema;
  risk: "safe" | "sensitive" | "critical";
};

export type ToolContext = {
  requestId: string;
  user: UserIdentity;
};

export type ToolResult =
  | ToolSuccessResult
  | ToolErrorResult;

export type ToolSuccessResult = {
  type: "success";
  toolCallId: string;
  toolId: string;
  output: unknown;
};

export type ToolErrorResult = {
  type: "error";
  toolCallId: string;
  toolId: string;
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
};
