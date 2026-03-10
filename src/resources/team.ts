import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PayozaClient } from "../client.js";

export function registerResources(server: McpServer, client: PayozaClient) {
  server.resource("team_info", "payoza://team/info", async (uri) => {
    try {
      const me = await client.getMe();
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(me.data, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/plain",
            text: `Failed to fetch team info: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
      };
    }
  });

  server.resource("api_docs", "payoza://docs/api", async (uri) => {
    const docs = `# Payoza API Reference

Base URL: Configured via PAYOZA_API_URL environment variable.

## Authentication
All endpoints require:
- \`Authorization: Bearer <JWT_TOKEN>\` header
- \`X-Team-ID: <TEAM_ID>\` header

## Response Format
All responses follow the envelope format:
\`\`\`json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "per_page": 20, "total": 100 }  // for list endpoints
}
\`\`\`

Error responses:
\`\`\`json
{
  "success": false,
  "error": { "code": "VALIDATION_ERROR", "message": "..." }
}
\`\`\`

## Endpoints

### Payment Links
- \`GET    /v1/payment-links\`          — List (paginated)
- \`POST   /v1/payment-links\`          — Create
- \`GET    /v1/payment-links/:id\`      — Get by ID
- \`PATCH  /v1/payment-links/:id\`      — Update
- \`DELETE /v1/payment-links/:id\`      — Delete

### Customers
- \`GET    /v1/customers\`              — List (paginated)
- \`POST   /v1/customers\`              — Create
- \`GET    /v1/customers/:id\`          — Get by ID
- \`PATCH  /v1/customers/:id\`          — Update

### Transactions
- \`GET    /v1/transactions\`           — List (paginated)
- \`GET    /v1/transactions/:id\`       — Get by ID

### Balance
- \`GET    /v1/balance\`                — Get balances
- \`GET    /v1/balance/ledger\`         — Ledger entries (paginated)

### Webhooks
- \`GET    /v1/webhooks\`               — List (paginated)
- \`POST   /v1/webhooks\`               — Create
- \`PATCH  /v1/webhooks/:id\`           — Update
- \`DELETE /v1/webhooks/:id\`           — Delete

### Prices (public)
- \`GET    /v1/prices?tokens=SOL,ETH&quote=USD\` — Get multiple prices
- \`GET    /v1/prices/rate?from=SOL&to=USD\`      — Get single exchange rate

### Analytics
- \`GET    /v1/analytics/revenue\`      — Daily revenue data

### Checkout Sessions
- \`POST   /v1/checkout/sessions\`      — Create session
- \`GET    /v1/checkout/sessions/:id\`  — Get session

### Supported Chains
solana, ethereum, base, polygon, bsc, arbitrum, avalanche

### Supported Tokens
SOL, ETH, BTC, USDC, USDT, DAI, and more depending on chain configuration.
`;

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: docs,
        },
      ],
    };
  });
}
