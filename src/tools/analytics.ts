import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PayozaClient } from "../client.js";

export function registerAnalyticsTools(
  server: McpServer,
  client: PayozaClient
) {
  server.tool(
    "get_revenue_analytics",
    "Get daily revenue analytics data. Returns time-series data of revenue grouped by day.",
    {
      start_date: z
        .string()
        .optional()
        .describe("Start date in YYYY-MM-DD format"),
      end_date: z
        .string()
        .optional()
        .describe("End date in YYYY-MM-DD format"),
    },
    async ({ start_date, end_date }) => {
      const query: Record<string, string> = {};
      if (start_date) query.start_date = start_date;
      if (end_date) query.end_date = end_date;

      const res = await client.get("/v1/analytics/revenue", query);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "get_platform_fee_analytics",
    "Get platform fee analytics data. Returns aggregated fee data.",
    {
      start_date: z
        .string()
        .optional()
        .describe("Start date in YYYY-MM-DD format"),
      end_date: z
        .string()
        .optional()
        .describe("End date in YYYY-MM-DD format"),
    },
    async ({ start_date, end_date }) => {
      const query: Record<string, string> = {};
      if (start_date) query.start_date = start_date;
      if (end_date) query.end_date = end_date;

      const res = await client.get("/v1/analytics/platform-fees", query);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );
}
