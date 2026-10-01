import { randomUUID } from "node:crypto";

import type { AgentRequest, AgentResponse } from "../types/agent.js";

export class AgentCore {
  async process(request: AgentRequest): Promise<AgentResponse> {
    const requestId = randomUUID();

    return {
      requestId,
      userId: request.userId,
      content: "Agent Core inicializado. O processamento com a OpenAI será implementado nas próximas etapas.",
    };
  }
}
