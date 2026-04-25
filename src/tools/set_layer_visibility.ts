import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerSetLayerVisibilityTool(server: McpServer) {
  server.tool(
    "set_layer_visibility",
    "Turn a layer on or off in the current AutoCAD drawing.",
    {
      name: z.string().describe("Name of the layer to change visibility."),
      visible: z.boolean().describe("true = turn layer ON, false = turn layer OFF."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("set_layer_visibility", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `set_layer_visibility failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
