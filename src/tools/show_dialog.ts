import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerShowDialogTool(server: McpServer) {
  server.tool(
    "show_dialog",
    "Show a message dialog box inside AutoCAD.",
    {
      message: z.string().describe("The message text to display in the dialog."),
      title: z.string().optional().describe("Optional dialog title. Defaults to 'MCP Message'."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("show_dialog", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `show_dialog failed: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );
}
