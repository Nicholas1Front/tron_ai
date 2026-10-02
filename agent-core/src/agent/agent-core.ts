import { randomUUID } from "node:crypto";

import type { AIProvider } from "../ai/ai-provider.js";
import type { AgentRequest, AgentResponse } from "../types/agent.js";

export class AgentCore {
  constructor(private readonly aiProvider: AIProvider) {}

  async process(request: AgentRequest): Promise<AgentResponse> {
    const requestId = randomUUID();
    const aiResponse = await this.aiProvider.generate({
      input: request.input.content,
    });

    if (aiResponse.type === "tool_call") {
      throw new Error(
        "Tool calling is not implemented in AgentCore yet.",
      );
    }

    return {
      requestId,
      userId: request.userId,
      content: aiResponse.content,
    };
  }
}
