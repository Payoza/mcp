import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PayozaClient } from "../client.js";

export function registerBalanceTools(
  server: McpServer,
  client: PayozaClient
) {
  server.tool(
    "get_balances",
    "Get current balances for the team across all currencies and chains.",
    {},
    async () => {
      const res = await client.get("/v1/balance");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "get_balance_ledger",
    "Get paginated balance ledger entries showing all credits and debits. Each entry includes entry type, amount, currency, chain, source, and description.",
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
      const res = await client.get("/v1/balance/ledger", {
        page: String(page),
        per_page: String(per_page),
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );
}
