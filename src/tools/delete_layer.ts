import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerDeleteLayerTool(server: McpServer) {
  server.tool(
    "delete_layer",
    "Delete a layer from the current AutoCAD drawing. The layer must be empty (no entities) and not the current layer.",
    {
      name: z.string().describe("Name of the layer to delete."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("delete_layer", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `delete_layer failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
