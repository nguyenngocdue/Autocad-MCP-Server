import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerCreateCircleTool(server: McpServer) {
  server.tool(
    "create_circle",
    "Create a circle in the current AutoCAD drawing's model space.",
    {
      centerX: z.number().describe("X coordinate of the center point."),
      centerY: z.number().describe("Y coordinate of the center point."),
      centerZ: z.number().optional().describe("Z coordinate of the center point. Defaults to 0."),
      radius: z.number().positive().describe("Radius of the circle."),
      layer: z.string().optional().describe("Layer name to place the circle on. Defaults to current layer."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("create_circle", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `create_circle failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
