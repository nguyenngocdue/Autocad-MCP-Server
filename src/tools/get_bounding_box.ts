import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerGetBoundingBoxTool(server: McpServer) {
  server.tool(
    "get_bounding_box",
    "Get the axis-aligned bounding box (min/max extents) of an entity in the AutoCAD drawing.",
    {
      handle: z.string().describe("The entity handle. Use get_entities to find handles."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("get_bounding_box", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `get_bounding_box failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
