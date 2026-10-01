import Fastify, { type FastifyInstance } from "fastify";
import { z } from "zod";

import { AgentCore } from "../agent/agent-core.js";

const agentRequestSchema = z.object({
  userId: z.string().min(1),
  input: z.object({
    type: z.literal("text"),
    content: z.string().min(1),
  }),
});

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: true,
  });

  const agentCore = new AgentCore();

  app.get("/health", async () => ({
    status: "ok",
    service: "agent-core",
  }));

  app.post("/api/v1/agent/requests", async (request, reply) => {
    const result = agentRequestSchema.safeParse(request.body);

    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid agent request.",
        issues: result.error.issues,
      });
    }

    const response = await agentCore.process(result.data);

    return reply.send({
      message: "Agent request processed.",
      data: response,
    });
  });

  return app;
}
