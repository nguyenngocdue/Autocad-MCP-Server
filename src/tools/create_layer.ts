import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerCreateLayerTool(server: McpServer) {
  server.tool(
    "create_layer",
    "Create a new layer in the current AutoCAD drawing with optional color, linetype, and lineweight.",
    {
      name: z.string().describe("Name of the new layer."),
      color: z.number().int().min(1).max(255).optional().describe("AutoCAD color index (1-255). e.g. 1=Red, 2=Yellow, 3=Green."),
      linetype: z.string().optional().describe("Linetype name, e.g. 'Continuous', 'DASHED'. Must be loaded in drawing."),
      lineweight: z.number().optional().describe("Lineweight in mm * 100 (e.g. 25 = 0.25mm). Standard values: 13,18,25,35,50,70,100."),
      description: z.string().optional().describe("Optional description for the layer."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("create_layer", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `create_layer failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
