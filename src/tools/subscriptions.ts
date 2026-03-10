import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PayozaClient } from "../client.js";

export function registerSubscriptionTools(
  server: McpServer,
  client: PayozaClient
) {
  server.tool(
    "list_subscriptions",
    "List subscriptions with pagination. Returns subscription details including status, plan, amount, currency, and billing cycle.",
    {
      page: z.number().int().min(1).default(1).describe("Page number"),
      per_page: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20)
        .describe("Items per page"),
    },
    async ({ page, per_page }) => {
      const res = await client.get("/v1/subscriptions", {
        page: String(page),
        per_page: String(per_page),
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "get_subscription",
    "Get a single subscription by ID. Returns full subscription details.",
    {
      id: z.string().describe("Subscription ID"),
    },
    async ({ id }) => {
      const res = await client.get(`/v1/subscriptions/${id}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "pause_subscription",
    "Pause an active subscription by ID.",
    {
      id: z.string().describe("Subscription ID to pause"),
    },
    async ({ id }) => {
      const res = await client.post(`/v1/subscriptions/${id}/pause`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "resume_subscription",
    "Resume a paused subscription by ID.",
    {
      id: z.string().describe("Subscription ID to resume"),
    },
    async ({ id }) => {
      const res = await client.post(`/v1/subscriptions/${id}/resume`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "cancel_subscription",
    "Cancel a subscription by ID.",
    {
      id: z.string().describe("Subscription ID to cancel"),
    },
    async ({ id }) => {
      const res = await client.post(`/v1/subscriptions/${id}/cancel`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );
}
