import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerGetEntitiesTool(server: McpServer) {
  server.tool(
    "get_entities",
    "Get entities (objects) from the model space of the current AutoCAD drawing. Can filter by layer or entity type (LINE, CIRCLE, ARC, TEXT, INSERT, etc.).",
    {
      limit: z.number().int().positive().optional().describe("Maximum number of entities to return. Defaults to 100."),
      layer: z.string().optional().describe("Filter entities by layer name (exact match)."),
      type: z.string().optional().describe("Filter entities by DXF type (e.g. LINE, CIRCLE, ARC, LWPOLYLINE, TEXT, MTEXT, INSERT, DIMENSION)."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("get_entities", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `get_entities failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
