export type AgentInput = {
  type: "text";
  content: string;
};

export type AgentRequest = {
  userId: string;
  input: AgentInput;
};

export type AgentResponse = {
  requestId: string;
  userId: string;
  content: string;
};
