import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PayozaClient } from "../client.js";

export function registerWebhookTools(
  server: McpServer,
  client: PayozaClient
) {
  server.tool(
    "list_webhooks",
    "List configured webhooks with pagination. Returns webhook URL, subscribed events, status, and secret.",
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
      const res = await client.get("/v1/webhooks", {
        page: String(page),
        per_page: String(per_page),
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "create_webhook",
    "Create a new webhook endpoint. Specify the URL to receive events and which event types to subscribe to (e.g. 'payment.completed', 'checkout.created').",
    {
      url: z.string().url().describe("Webhook endpoint URL"),
      events: z
        .array(z.string())
        .describe(
          "Event types to subscribe to (e.g. ['payment.completed', 'checkout.created'])"
        ),
    },
    async ({ url, events }) => {
      const res = await client.post("/v1/webhooks", { url, events });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "update_webhook",
    "Update an existing webhook by ID. Only provided fields are updated.",
    {
      id: z.string().describe("Webhook ID"),
      url: z.string().url().optional().describe("New webhook endpoint URL"),
      events: z
        .array(z.string())
        .optional()
        .describe("New event types to subscribe to"),
    },
    async ({ id, ...updates }) => {
      const body: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(updates)) {
        if (v !== undefined) body[k] = v;
      }
      const res = await client.patch(`/v1/webhooks/${id}`, body);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "get_webhook_events",
    "Get delivery events for a specific webhook. Shows recent event deliveries, their status, and response codes.",
    {
      id: z.string().describe("Webhook ID"),
    },
    async ({ id }) => {
      const res = await client.get(`/v1/webhooks/${id}/events`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_webhook",
    "Delete a webhook by ID.",
    {
      id: z.string().describe("Webhook ID to delete"),
    },
    async ({ id }) => {
      await client.delete(`/v1/webhooks/${id}`);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { success: true, message: `Webhook ${id} deleted` },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
