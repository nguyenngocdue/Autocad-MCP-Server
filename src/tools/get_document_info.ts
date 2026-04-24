import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerGetDocumentInfoTool(server: McpServer) {
  server.tool(
    "get_document_info",
    "Get information about the currently active AutoCAD drawing (DWG file name, units, drawing extents, limits).",
    {},
    async (_args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("get_document_info", {});
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `get_document_info failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
