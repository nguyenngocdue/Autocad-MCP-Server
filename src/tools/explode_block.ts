import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerExplodeBlockTool(server: McpServer) {
  server.tool(
    "explode_block",
    "Explode a block reference into its constituent entities in the AutoCAD drawing.",
    {
      handle: z.string().describe("The handle of the block reference to explode. Use get_entities with type='INSERT' to find block references."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("explode_block", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `explode_block failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
