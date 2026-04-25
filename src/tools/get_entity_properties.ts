import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerGetEntityPropertiesTool(server: McpServer) {
  server.tool(
    "get_entity_properties",
    "Get detailed properties of a specific entity in the AutoCAD drawing (layer, color, geometry, length, area, etc.).",
    {
      handle: z.string().describe("The entity handle to inspect. Use get_entities to find handles."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("get_entity_properties", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `get_entity_properties failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
