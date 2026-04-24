import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerGetLayersTool(server: McpServer) {
  server.tool(
    "get_layers",
    "Get all layers in the current AutoCAD drawing, including their on/off state, frozen state, color, and linetype.",
    {},
    async (_args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("get_layers", {});
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `get_layers failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
