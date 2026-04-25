import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerCreateArcTool(server: McpServer) {
  server.tool(
    "create_arc",
    "Create an arc in the current AutoCAD drawing using center, radius, start angle and end angle.",
    {
      centerX: z.number().describe("X coordinate of the arc center."),
      centerY: z.number().describe("Y coordinate of the arc center."),
      centerZ: z.number().optional().describe("Z coordinate. Defaults to 0."),
      radius: z.number().positive().describe("Radius of the arc."),
      startAngle: z.number().describe("Start angle in degrees (0 = East, counter-clockwise)."),
      endAngle: z.number().describe("End angle in degrees (counter-clockwise from start)."),
      layer: z.string().optional().describe("Layer name. Defaults to current layer."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("create_arc", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `create_arc failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
