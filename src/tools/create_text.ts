import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerCreateTextTool(server: McpServer) {
  server.tool(
    "create_text",
    "Add a single-line text annotation to the current AutoCAD drawing's model space.",
    {
      text: z.string().describe("The text string to add."),
      x: z.number().describe("X coordinate of the text insertion point."),
      y: z.number().describe("Y coordinate of the text insertion point."),
      z: z.number().optional().describe("Z coordinate. Defaults to 0."),
      height: z.number().positive().optional().describe("Text height in drawing units. Defaults to 2.5."),
      rotation: z.number().optional().describe("Rotation angle in degrees. Defaults to 0."),
      layer: z.string().optional().describe("Layer name. Defaults to current layer."),
      style: z.string().optional().describe("Text style name. Defaults to 'Standard'."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("create_text", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `create_text failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
