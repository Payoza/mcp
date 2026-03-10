import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PayozaClient } from "../client.js";

export function registerTeamTools(
  server: McpServer,
  client: PayozaClient
) {
  server.tool(
    "list_team_members",
    "List all members of the current team. Returns member name, email, role, and join date.",
    {},
    async () => {
      const res = await client.get("/v1/team/members");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "invite_team_member",
    "Invite a new member to the team by email.",
    {
      email: z.string().describe("Email address to invite"),
      role: z
        .string()
        .default("member")
        .describe("Role for the new member (e.g. 'admin', 'member')"),
    },
    async ({ email, role }) => {
      const res = await client.post("/v1/team/members", { email, role });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "update_team_member",
    "Update a team member's role by ID.",
    {
      id: z.string().describe("Team member ID"),
      role: z.string().describe("New role (e.g. 'admin', 'member')"),
    },
    async ({ id, role }) => {
      const res = await client.patch(`/v1/team/members/${id}`, { role });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(res, null, 2) }],
      };
    }
  );

  server.tool(
    "remove_team_member",
    "Remove a team member by ID.",
    {
      id: z.string().describe("Team member ID to remove"),
    },
    async ({ id }) => {
      await client.delete(`/v1/team/members/${id}`);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { success: true, message: `Team member ${id} removed` },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
