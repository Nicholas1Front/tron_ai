import { GoogleGenAI } from "@google/genai";

import type { AIProvider, AIRequest, AIResponse } from "./ai-provider.js";

export class GeminiProvider implements AIProvider {
  private readonly client: GoogleGenAI;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    this.client = new GoogleGenAI({
      apiKey,
    });

    this.model = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    if (typeof request.input !== "string") {
      throw new Error(
        "GeminiProvider does not yet support structured AI input.",
      );
    }

    const interaction = await this.client.interactions.create({
      model: this.model,
      input: request.input,
    });

    const content = interaction.output_text;

    if (!content) {
      throw new Error("Gemini returned no text output.");
    }

    return {
      type: "text",
      content,
    };
  }
}
