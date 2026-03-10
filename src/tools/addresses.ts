import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PayozaClient } from "../client.js";

export function registerAddressTools(
  server: McpServer,
  client: PayozaClient
) {
  server.tool(
    "list_addresses",
    "List deposit addresses configured for the team. Returns address, chain, and status.",
    {},
    async () => {
      const res = await client.get("/v1/addresses");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "create_address",
    "Create a new deposit address for a specific blockchain network.",
    {
      chain: z
        .string()
        .describe("Blockchain network (e.g. solana, ethereum, base, polygon, bsc, arbitrum, avalanche)"),
    },
    async ({ chain }) => {
      const res = await client.post("/v1/addresses", { chain });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );
}
