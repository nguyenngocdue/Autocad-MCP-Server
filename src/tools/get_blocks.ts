import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerGetBlocksTool(server: McpServer) {
  server.tool(
    "get_blocks",
    "List all block definitions in the current AutoCAD drawing.",
    {},
    async (_args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("get_blocks", {});
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `get_blocks failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
