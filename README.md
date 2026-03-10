<p align="center">
  <img src="icon.svg" width="64" height="64" alt="Payoza" />
</p>

<h1 align="center">Payoza MCP Server</h1>

<p align="center">
  MCP (Model Context Protocol) server that exposes the <strong>Payoza crypto payments API</strong> to AI assistants like Claude, Cursor, and Windsurf.
</p>

---

## Setup

```bash
cd mcp
npm install
npm run build
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PAYOZA_API_URL` | No | `http://localhost:8080` | Payoza API base URL |
| `PAYOZA_API_TOKEN` | Yes | — | JWT bearer token |
| `PAYOZA_TEAM_ID` | Yes | — | Team ID for scoped requests |

## Claude Desktop Configuration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "payoza": {
      "command": "node",
      "args": ["/path/to/mcp/dist/index.js"],
      "env": {
        "PAYOZA_API_URL": "https://api.payoza.io",
        "PAYOZA_API_TOKEN": "your-jwt-token",
        "PAYOZA_TEAM_ID": "your-team-id"
      }
    }
  }
}
```

## Claude Code Configuration

```bash
claude mcp add payoza -- node /path/to/mcp/dist/index.js
```

Or add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "payoza": {
      "command": "node",
      "args": ["/path/to/mcp/dist/index.js"],
      "env": {
        "PAYOZA_API_URL": "https://api.payoza.io",
        "PAYOZA_API_TOKEN": "your-jwt-token",
        "PAYOZA_TEAM_ID": "your-team-id"
      }
    }
  }
}
```

## Available Tools (38 total)

### Overview
| Tool | Description |
|---|---|
| `get_overview` | High-level account overview: balances, transaction/link/customer counts |

### Payment Links
| Tool | Description |
|---|---|
| `list_payment_links` | List payment links with pagination |
| `create_payment_link` | Create a new payment link |
| `update_payment_link` | Update a payment link |
| `delete_payment_link` | Delete a payment link |

### Checkout Sessions
| Tool | Description |
|---|---|
| `list_checkout_sessions` | List checkout sessions with pagination |
| `create_checkout_session` | Create a new checkout session |
| `get_checkout_session` | Get checkout session details by ID |

### Customers
| Tool | Description |
|---|---|
| `list_customers` | List customers with pagination |
| `create_customer` | Create a new customer |
| `get_customer` | Get customer details by ID |
| `update_customer` | Update a customer |

### Transactions
| Tool | Description |
|---|---|
| `list_transactions` | List transactions with pagination |
| `get_transaction` | Get transaction details by ID |

### Subscriptions
| Tool | Description |
|---|---|
| `list_subscriptions` | List subscriptions with pagination |
| `get_subscription` | Get subscription details by ID |
| `pause_subscription` | Pause an active subscription |
| `resume_subscription` | Resume a paused subscription |
| `cancel_subscription` | Cancel a subscription |

### Balance
| Tool | Description |
|---|---|
| `get_balances` | Get balances across all currencies/chains |
| `get_balance_ledger` | Get paginated ledger entries |

### Settlements
| Tool | Description |
|---|---|
| `list_settlements` | List settlements with pagination |

### Webhooks
| Tool | Description |
|---|---|
| `list_webhooks` | List configured webhooks |
| `create_webhook` | Create a webhook endpoint |
| `update_webhook` | Update a webhook |
| `get_webhook_events` | Get delivery events for a webhook |
| `delete_webhook` | Delete a webhook |

### Prices
| Tool | Description |
|---|---|
| `get_exchange_rate` | Get exchange rate between two currencies |
| `get_prices` | Get prices for multiple tokens |

### Analytics
| Tool | Description |
|---|---|
| `get_revenue_analytics` | Get daily revenue analytics data |
| `get_platform_fee_analytics` | Get platform fee analytics data |

### Addresses
| Tool | Description |
|---|---|
| `list_addresses` | List deposit addresses |
| `create_address` | Create a deposit address for a chain |

### Notifications
| Tool | Description |
|---|---|
| `list_notifications` | List notifications with pagination |
| `get_unread_notification_count` | Get unread notification count |
| `mark_notification_read` | Mark a notification as read |
| `mark_all_notifications_read` | Mark all notifications as read |
| `delete_notification` | Delete a notification |

### Team Members
| Tool | Description |
|---|---|
| `list_team_members` | List team members |
| `invite_team_member` | Invite a new member |
| `update_team_member` | Update a member's role |
| `remove_team_member` | Remove a team member |

### API Keys
| Tool | Description |
|---|---|
| `list_api_keys` | List API keys |
| `create_api_key` | Create a new API key |
| `delete_api_key` | Delete an API key |

## Available Resources

| URI | Description |
|---|---|
| `payoza://team/info` | Current authenticated user/team information |
| `payoza://docs/api` | API documentation summary |

## Supported Chains

`solana` · `ethereum` · `base` · `polygon` · `bsc` · `arbitrum` · `avalanche`

## Supported Tokens

`SOL` · `ETH` · `BTC` · `USDC` · `USDT` · `DAI` and more depending on chain configuration.

## Development

```bash
npm run dev          # Run with tsx (no build step)
npm run typecheck    # Type-check without emitting
npm run build        # Compile to dist/
npm start            # Run compiled output
```
