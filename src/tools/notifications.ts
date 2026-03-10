import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PayozaClient } from "../client.js";

export function registerNotificationTools(
  server: McpServer,
  client: PayozaClient
) {
  server.tool(
    "list_notifications",
    "List notifications with pagination. Returns notification title, message, type, read status, and timestamps.",
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
      const res = await client.get("/v1/notifications", {
        page: String(page),
        per_page: String(per_page),
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "get_unread_notification_count",
    "Get the count of unread notifications.",
    {},
    async () => {
      const res = await client.get("/v1/notifications/unread-count");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "mark_notification_read",
    "Mark a single notification as read by ID.",
    {
      id: z.string().describe("Notification ID"),
    },
    async ({ id }) => {
      const res = await client.patch(`/v1/notifications/${id}/read`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "mark_all_notifications_read",
    "Mark all notifications as read.",
    {},
    async () => {
      const res = await client.post("/v1/notifications/read-all");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_notification",
    "Delete a notification by ID.",
    {
      id: z.string().describe("Notification ID to delete"),
    },
    async ({ id }) => {
      await client.delete(`/v1/notifications/${id}`);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { success: true, message: `Notification ${id} deleted` },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
