import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerMeasureAreaTool(server: McpServer) {
  server.tool(
    "measure_area",
    "Calculate the area and perimeter of a closed entity (polyline, circle, region, hatch, etc.) by its handle.",
    {
      handle: z.string().describe("The entity handle of the closed entity. Use get_entities to find handles."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("measure_area", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `measure_area failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
