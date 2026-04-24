import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerCreateLineTool(server: McpServer) {
  server.tool(
    "create_line",
    "Create a straight line in the current AutoCAD drawing's model space.",
    {
      startX: z.number().describe("X coordinate of the start point."),
      startY: z.number().describe("Y coordinate of the start point."),
      startZ: z.number().optional().describe("Z coordinate of the start point. Defaults to 0."),
      endX: z.number().describe("X coordinate of the end point."),
      endY: z.number().describe("Y coordinate of the end point."),
      endZ: z.number().optional().describe("Z coordinate of the end point. Defaults to 0."),
      layer: z.string().optional().describe("Layer name to place the line on. Defaults to current layer (0)."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("create_line", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `create_line failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
