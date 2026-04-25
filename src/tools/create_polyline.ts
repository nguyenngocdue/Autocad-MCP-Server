import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number().optional(),
});

export function registerCreatePolylineTool(server: McpServer) {
  server.tool(
    "create_polyline",
    "Create a polyline in the current AutoCAD drawing from a list of points.",
    {
      points: z.array(PointSchema).min(2).describe("Array of points, each with x, y, and optional z."),
      closed: z.boolean().optional().describe("If true, close the polyline back to the first point. Defaults to false."),
      layer: z.string().optional().describe("Layer name. Defaults to current layer."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("create_polyline", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `create_polyline failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
