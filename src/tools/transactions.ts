import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PayozaClient } from "../client.js";

export function registerTransactionTools(
  server: McpServer,
  client: PayozaClient
) {
  server.tool(
    "list_transactions",
    "List transactions with pagination. Returns transaction details including type, status, amount, currency, chain, fees, and timestamps.",
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
      const res = await client.get("/v1/transactions", {
        page: String(page),
        per_page: String(per_page),
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "get_transaction",
    "Get a single transaction by ID. Returns full transaction details including tx hash, addresses, fees, exchange rate, and USD amounts.",
    {
      id: z.string().describe("Transaction ID"),
    },
    async ({ id }) => {
      const res = await client.get(`/v1/transactions/${id}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );
}
