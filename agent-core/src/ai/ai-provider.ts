import type { AIRequest, AIResponse } from "../types/ai.js";

export type { AIRequest, AIResponse } from "../types/ai.js";

export interface AIProvider {
  generate(request: AIRequest): Promise<AIResponse>;
}
