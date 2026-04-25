import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerCopyEntityTool(server: McpServer) {
  server.tool(
    "copy_entity",
    "Copy an entity in the AutoCAD drawing to a new position defined by a displacement vector.",
    {
      handle: z.string().describe("The entity handle to copy. Use get_entities to find handles."),
      dx: z.number().describe("Displacement in X direction."),
      dy: z.number().describe("Displacement in Y direction."),
      dz: z.number().optional().describe("Displacement in Z direction. Defaults to 0."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("copy_entity", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `copy_entity failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
