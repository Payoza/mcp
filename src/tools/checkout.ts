import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PayozaClient } from "../client.js";

export function registerCheckoutTools(
  server: McpServer,
  client: PayozaClient
) {
  server.tool(
    "list_checkout_sessions",
    "List checkout sessions with pagination. Returns session details including status, amount, currency, and customer info.",
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
      const res = await client.get("/v1/checkout-sessions", {
        page: String(page),
        per_page: String(per_page),
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "create_checkout_session",
    "Create a new checkout session for a one-time payment. Returns a session URL for the customer to complete payment.",
    {
      amount: z.string().describe("Payment amount as a decimal string (e.g. '10.00')"),
      currency: z.string().describe("Price currency code (e.g. USD)"),
      accepted_networks: z
        .array(z.string())
        .default([])
        .describe("Blockchain networks to accept (e.g. ['solana', 'ethereum'])"),
      accepted_tokens: z
        .array(z.string())
        .default([])
        .describe("Token symbols to accept (e.g. ['SOL', 'USDC'])"),
      success_url: z.string().optional().describe("Redirect URL after successful payment"),
      cancel_url: z.string().optional().describe("Redirect URL if payment is cancelled"),
      customer_id: z.string().optional().describe("Existing customer ID to associate"),
      metadata: z
        .record(z.string(), z.string())
        .optional()
        .describe("Key-value metadata to attach to the session"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        amount: params.amount,
        currency: params.currency,
        accepted_networks: params.accepted_networks,
        accepted_tokens: params.accepted_tokens,
      };
      if (params.success_url !== undefined) body.success_url = params.success_url;
      if (params.cancel_url !== undefined) body.cancel_url = params.cancel_url;
      if (params.customer_id !== undefined) body.customer_id = params.customer_id;
      if (params.metadata !== undefined) body.metadata = params.metadata;

      const res = await client.post("/v1/checkout/sessions", body);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "get_checkout_session",
    "Get a checkout session by ID. Returns full session details including payment status.",
    {
      id: z.string().describe("Checkout session ID"),
    },
    async ({ id }) => {
      const res = await client.get(`/v1/checkout/sessions/${id}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );
}
