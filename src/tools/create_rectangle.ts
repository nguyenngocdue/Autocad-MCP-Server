import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerCreateRectangleTool(server: McpServer) {
  server.tool(
    "create_rectangle",
    "Create a rectangle (closed polyline) in the current AutoCAD drawing's model space using two corner points.",
    {
      x1: z.number().describe("X coordinate of the first corner."),
      y1: z.number().describe("Y coordinate of the first corner."),
      x2: z.number().describe("X coordinate of the opposite corner."),
      y2: z.number().describe("Y coordinate of the opposite corner."),
      z: z.number().optional().describe("Z elevation for all points. Defaults to 0."),
      layer: z.string().optional().describe("Layer name. Defaults to current layer."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("create_rectangle", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `create_rectangle failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
