import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PayozaClient } from "../client.js";

export function registerCustomerTools(
  server: McpServer,
  client: PayozaClient
) {
  server.tool(
    "list_customers",
    "List customers with pagination. Returns customer ID, external ID, name, email, wallet, status, total spent, and transaction count.",
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
      const res = await client.get("/v1/customers", {
        page: String(page),
        per_page: String(per_page),
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "create_customer",
    "Create a new customer. Requires an external_id (your internal customer identifier).",
    {
      external_id: z
        .string()
        .describe(
          "Your internal customer identifier (unique within the team)"
        ),
      first_name: z.string().optional().describe("Customer first name"),
      last_name: z.string().optional().describe("Customer last name"),
      email: z.string().optional().describe("Customer email address"),
      wallet_address: z
        .string()
        .optional()
        .describe("Customer wallet address"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        external_id: params.external_id,
      };
      if (params.first_name !== undefined) body.first_name = params.first_name;
      if (params.last_name !== undefined) body.last_name = params.last_name;
      if (params.email !== undefined) body.email = params.email;
      if (params.wallet_address !== undefined)
        body.wallet_address = params.wallet_address;

      const res = await client.post("/v1/customers", body);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "get_customer",
    "Get a single customer by ID. Returns full customer details including total spent and transaction count.",
    {
      id: z.string().describe("Customer ID"),
    },
    async ({ id }) => {
      const res = await client.get(`/v1/customers/${id}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "update_customer",
    "Update an existing customer by ID. Only provided fields are updated.",
    {
      id: z.string().describe("Customer ID"),
      first_name: z.string().optional().describe("New first name"),
      last_name: z.string().optional().describe("New last name"),
      email: z.string().optional().describe("New email address"),
      wallet_address: z.string().optional().describe("New wallet address"),
    },
    async ({ id, ...updates }) => {
      const body: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(updates)) {
        if (v !== undefined) body[k] = v;
      }
      const res = await client.patch(`/v1/customers/${id}`, body);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );
}
