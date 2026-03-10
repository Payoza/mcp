import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PayozaClient } from "../client.js";

export function registerPriceTools(
  server: McpServer,
  client: PayozaClient
) {
  server.tool(
    "get_exchange_rate",
    "Get the exchange rate between two currencies/tokens. Example: from='SOL', to='USD'.",
    {
      from: z.string().describe("Source currency/token symbol (e.g. SOL, ETH, BTC)"),
      to: z.string().describe("Target currency symbol (e.g. USD, EUR)"),
    },
    async ({ from, to }) => {
      const res = await client.get("/v1/prices/rate", { from, to });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "get_prices",
    "Get current prices for multiple tokens at once. Returns price in the specified quote currency.",
    {
      tokens: z
        .array(z.string())
        .describe("Token symbols to get prices for (e.g. ['SOL', 'ETH', 'BTC'])"),
      quote: z
        .string()
        .default("USD")
        .describe("Quote currency (default: USD)"),
    },
    async ({ tokens, quote }) => {
      const res = await client.get("/v1/prices", {
        tokens: tokens.join(","),
        quote,
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );
}
