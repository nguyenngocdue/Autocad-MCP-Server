import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerMeasureDistanceTool(server: McpServer) {
  server.tool(
    "measure_distance",
    "Calculate the Euclidean distance between two points in 3D space.",
    {
      x1: z.number().describe("X coordinate of the first point."),
      y1: z.number().describe("Y coordinate of the first point."),
      z1: z.number().optional().describe("Z coordinate of the first point. Defaults to 0."),
      x2: z.number().describe("X coordinate of the second point."),
      y2: z.number().describe("Y coordinate of the second point."),
      z2: z.number().optional().describe("Z coordinate of the second point. Defaults to 0."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("measure_distance", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `measure_distance failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
