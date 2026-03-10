import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PayozaClient } from "../client.js";

export function registerApiKeyTools(
  server: McpServer,
  client: PayozaClient
) {
  server.tool(
    "list_api_keys",
    "List API keys for the team. Returns key name, prefix, permissions, and creation date.",
    {},
    async () => {
      const res = await client.get("/v1/api-keys");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "create_api_key",
    "Create a new API key. Returns the full key (only shown once) and its metadata.",
    {
      name: z.string().describe("Display name for the API key"),
      permissions: z
        .array(z.string())
        .optional()
        .describe("Permission scopes for this key"),
    },
    async (params) => {
      const body: Record<string, unknown> = { name: params.name };
      if (params.permissions !== undefined) body.permissions = params.permissions;

      const res = await client.post("/v1/api-keys", body);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_api_key",
    "Delete an API key by ID. This action is irreversible.",
    {
      id: z.string().describe("API key ID to delete"),
    },
    async ({ id }) => {
      await client.delete(`/v1/api-keys/${id}`);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { success: true, message: `API key ${id} deleted` },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
