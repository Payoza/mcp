import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PayozaClient } from "../client.js";

export function registerPaymentLinkTools(
  server: McpServer,
  client: PayozaClient
) {
  server.tool(
    "list_payment_links",
    "List payment links with pagination. Returns name, amount, currency, status, URL, click/payment counts.",
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
      const res = await client.get("/v1/payment-links", {
        page: String(page),
        per_page: String(per_page),
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "create_payment_link",
    "Create a new payment link for accepting crypto payments. Specify accepted networks (e.g. solana, ethereum) and tokens (e.g. SOL, USDC).",
    {
      name: z.string().describe("Display name for the payment link"),
      description: z
        .string()
        .optional()
        .describe("Optional description"),
      amount: z
        .string()
        .optional()
        .describe(
          "Fixed amount as a decimal string (e.g. '10.00'). Omit for open-amount links."
        ),
      currency: z
        .string()
        .describe("Price currency code (e.g. USD, USDC, SOL)"),
      accepted_networks: z
        .array(z.string())
        .default([])
        .describe(
          "Blockchain networks to accept (e.g. ['solana', 'ethereum'])"
        ),
      accepted_tokens: z
        .array(z.string())
        .default([])
        .describe("Token symbols to accept (e.g. ['SOL', 'USDC'])"),
      collect_name: z
        .boolean()
        .default(false)
        .describe("Whether to collect customer name"),
      collect_email: z
        .boolean()
        .default(false)
        .describe("Whether to collect customer email"),
      success_url: z
        .string()
        .optional()
        .describe("Redirect URL after successful payment"),
      cancel_url: z
        .string()
        .optional()
        .describe("Redirect URL if payment is cancelled"),
      link_mode: z
        .string()
        .default("one_time")
        .describe("Link mode: 'one_time' or 'subscription'"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        name: params.name,
        currency: params.currency,
        accepted_networks: params.accepted_networks,
        accepted_tokens: params.accepted_tokens,
        collect_name: params.collect_name,
        collect_email: params.collect_email,
        link_mode: params.link_mode,
      };
      if (params.description !== undefined)
        body.description = params.description;
      if (params.amount !== undefined) body.amount = params.amount;
      if (params.success_url !== undefined)
        body.success_url = params.success_url;
      if (params.cancel_url !== undefined) body.cancel_url = params.cancel_url;

      const res = await client.post("/v1/payment-links", body);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "update_payment_link",
    "Update an existing payment link by ID. Only provided fields are updated.",
    {
      id: z.string().describe("Payment link ID"),
      name: z.string().optional().describe("New display name"),
      description: z
        .string()
        .nullable()
        .optional()
        .describe("New description (null to clear)"),
      collect_name: z.boolean().optional().describe("Collect customer name"),
      collect_email: z.boolean().optional().describe("Collect customer email"),
      success_url: z
        .string()
        .nullable()
        .optional()
        .describe("Redirect URL after success (null to clear)"),
      cancel_url: z
        .string()
        .nullable()
        .optional()
        .describe("Redirect URL on cancel (null to clear)"),
      accepted_networks: z
        .array(z.string())
        .optional()
        .describe("Accepted blockchain networks"),
      accepted_tokens: z
        .array(z.string())
        .optional()
        .describe("Accepted token symbols"),
    },
    async ({ id, ...updates }) => {
      const body: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(updates)) {
        if (v !== undefined) body[k] = v;
      }
      const res = await client.patch(`/v1/payment-links/${id}`, body);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_payment_link",
    "Delete (soft-delete) a payment link by ID.",
    {
      id: z.string().describe("Payment link ID to delete"),
    },
    async ({ id }) => {
      const res = await client.delete(`/v1/payment-links/${id}`);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { success: true, message: `Payment link ${id} deleted` },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
