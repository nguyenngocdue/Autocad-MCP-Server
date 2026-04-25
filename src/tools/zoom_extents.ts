import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerZoomExtentsTool(server: McpServer) {
  server.tool(
    "zoom_extents",
    "Zoom the AutoCAD viewport to fit all visible entities in the drawing (equivalent of ZOOM EXTENTS command).",
    {},
    async (_args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("zoom_extents", {});
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `zoom_extents failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
