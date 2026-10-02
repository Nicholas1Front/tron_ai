export type AgentInput = {
  type: "text";
  content: string;
};

export type UserIdentity = {
  userId: string;
};

export type AgentContext = {
  requestId: string;
  user: UserIdentity;
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
