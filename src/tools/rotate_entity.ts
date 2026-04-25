import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerRotateEntityTool(server: McpServer) {
  server.tool(
    "rotate_entity",
    "Rotate an entity around a base point in the AutoCAD drawing.",
    {
      handle: z.string().describe("The entity handle to rotate. Use get_entities to find handles."),
      baseX: z.number().describe("X coordinate of the rotation base point."),
      baseY: z.number().describe("Y coordinate of the rotation base point."),
      baseZ: z.number().optional().describe("Z coordinate of the rotation base point. Defaults to 0."),
      angle: z.number().describe("Rotation angle in degrees (positive = counter-clockwise)."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("rotate_entity", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `rotate_entity failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
