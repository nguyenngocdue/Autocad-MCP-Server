import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerInsertBlockTool(server: McpServer) {
  server.tool(
    "insert_block",
    "Insert a block reference into the current AutoCAD drawing's model space.",
    {
      blockName: z.string().describe("Name of the block definition to insert. Must exist in the drawing."),
      x: z.number().describe("X coordinate of the insertion point."),
      y: z.number().describe("Y coordinate of the insertion point."),
      z: z.number().optional().describe("Z coordinate of the insertion point. Defaults to 0."),
      scaleX: z.number().positive().optional().describe("X scale factor. Defaults to 1."),
      scaleY: z.number().positive().optional().describe("Y scale factor. Defaults to 1."),
      scaleZ: z.number().positive().optional().describe("Z scale factor. Defaults to 1."),
      rotation: z.number().optional().describe("Rotation angle in degrees. Defaults to 0."),
      layer: z.string().optional().describe("Layer name. Defaults to current layer."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("insert_block", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `insert_block failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
