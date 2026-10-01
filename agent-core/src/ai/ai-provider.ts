export type AIRequest = {
  input: string;
};

export type AIResponse = {
  content: string;
};

export interface AIProvider {
  generate(request: AIRequest): Promise<AIResponse>;
}
