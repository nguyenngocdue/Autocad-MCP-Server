import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerMirrorEntityTool(server: McpServer) {
  server.tool(
    "mirror_entity",
    "Mirror an entity across a line defined by two points in the AutoCAD drawing.",
    {
      handle: z.string().describe("The entity handle to mirror. Use get_entities to find handles."),
      mirrorX1: z.number().describe("X of the first point on the mirror axis."),
      mirrorY1: z.number().describe("Y of the first point on the mirror axis."),
      mirrorX2: z.number().describe("X of the second point on the mirror axis."),
      mirrorY2: z.number().describe("Y of the second point on the mirror axis."),
      deleteSource: z.boolean().optional().describe("If true, delete the original entity after mirroring. Defaults to false."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("mirror_entity", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `mirror_entity failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
