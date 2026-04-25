import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerDeleteEntityTool(server: McpServer) {
  server.tool(
    "delete_entity",
    "Delete an entity from the current AutoCAD drawing by its handle.",
    {
      handle: z.string().describe("The entity handle (hex string) to delete. Use get_entities to find handles."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("delete_entity", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `delete_entity failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
