import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerSetCurrentLayerTool(server: McpServer) {
  server.tool(
    "set_current_layer",
    "Set the active (current) layer in the AutoCAD drawing. All subsequent geometry will be placed on this layer.",
    {
      name: z.string().describe("Name of the layer to set as current. The layer must already exist."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("set_current_layer", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `set_current_layer failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
