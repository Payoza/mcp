#!/usr/bin/env node

/**
 * Payoza MCP Server
 *
 * Exposes Payoza crypto payments API as MCP tools and resources
 * for AI assistant integration.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { PayozaClient } from "./client.js";
import { registerPaymentLinkTools } from "./tools/payment-links.js";
import { registerCustomerTools } from "./tools/customers.js";
import { registerTransactionTools } from "./tools/transactions.js";
import { registerBalanceTools } from "./tools/balance.js";
import { registerWebhookTools } from "./tools/webhooks.js";
import { registerPriceTools } from "./tools/prices.js";
import { registerSubscriptionTools } from "./tools/subscriptions.js";
import { registerCheckoutTools } from "./tools/checkout.js";
import { registerAddressTools } from "./tools/addresses.js";
import { registerSettlementTools } from "./tools/settlements.js";
import { registerAnalyticsTools } from "./tools/analytics.js";
import { registerNotificationTools } from "./tools/notifications.js";
import { registerApiKeyTools } from "./tools/api-keys.js";
import { registerTeamTools } from "./tools/team.js";
import { registerResources } from "./resources/team.js";

function getEnvOrThrow(key: string, fallback?: string): string {
  const val = process.env[key] ?? fallback;
  if (!val) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return val;
}

async function main() {
  const apiUrl = getEnvOrThrow("PAYOZA_API_URL", "http://localhost:8080");
  const apiToken = getEnvOrThrow("PAYOZA_API_TOKEN");
  const teamId = getEnvOrThrow("PAYOZA_TEAM_ID");

  const client = new PayozaClient({
    apiUrl,
    apiToken,
    teamId,
  });

  const server = new McpServer({
    name: "payoza",
    version: "1.0.0",
  });

  // Register all tools
  registerPaymentLinkTools(server, client);
  registerCustomerTools(server, client);
  registerTransactionTools(server, client);
  registerBalanceTools(server, client);
  registerWebhookTools(server, client);
  registerPriceTools(server, client);
  registerSubscriptionTools(server, client);
  registerCheckoutTools(server, client);
  registerAddressTools(server, client);
  registerSettlementTools(server, client);
  registerAnalyticsTools(server, client);
  registerNotificationTools(server, client);
  registerApiKeyTools(server, client);
  registerTeamTools(server, client);

  // Register resources
  registerResources(server, client);

  // Register the overview tool directly here (combines multiple API calls)
  const { z } = await import("zod");

  server.tool(
    "get_overview",
    "Get a high-level overview of the team's Payoza account: balances, recent transactions count, payment links count, and customer count.",
    {},
    async () => {
      const results: Record<string, unknown> = {};

      // Fetch balances, transactions, payment links, and customers in parallel
      const [balances, transactions, links, customers] =
        await Promise.allSettled([
          client.get("/v1/balance"),
          client.get("/v1/transactions", { page: "1", per_page: "1" }),
          client.get("/v1/payment-links", { page: "1", per_page: "1" }),
          client.get("/v1/customers", { page: "1", per_page: "1" }),
        ]);

      if (balances.status === "fulfilled") {
        results.balances = balances.value.data;
      }

      if (transactions.status === "fulfilled") {
        results.total_transactions = transactions.value.meta?.total ?? 0;
      }

      if (links.status === "fulfilled") {
        results.total_payment_links = links.value.meta?.total ?? 0;
      }

      if (customers.status === "fulfilled") {
        results.total_customers = customers.value.meta?.total ?? 0;
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }
  );

  // Start the server via stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
