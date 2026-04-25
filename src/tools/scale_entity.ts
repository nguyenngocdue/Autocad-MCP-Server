import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerScaleEntityTool(server: McpServer) {
  server.tool(
    "scale_entity",
    "Scale an entity uniformly around a base point in the AutoCAD drawing.",
    {
      handle: z.string().describe("The entity handle to scale. Use get_entities to find handles."),
      baseX: z.number().describe("X coordinate of the scale base point."),
      baseY: z.number().describe("Y coordinate of the scale base point."),
      baseZ: z.number().optional().describe("Z coordinate of the scale base point. Defaults to 0."),
      scaleFactor: z.number().positive().describe("Scale factor (e.g. 2.0 = double size, 0.5 = half size)."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("scale_entity", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `scale_entity failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
