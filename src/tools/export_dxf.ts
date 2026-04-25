import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerExportDxfTool(server: McpServer) {
  server.tool(
    "export_dxf",
    "Save a copy of the current AutoCAD drawing in DXF format.",
    {
      outputPath: z.string().describe("Full file path for the output DXF, e.g. 'C:\\\\Temp\\\\drawing.dxf'."),
      version: z.enum(["R12", "R14", "R2000", "R2004", "R2007", "R2010", "R2013", "R2018"]).optional()
        .describe("DXF format version. Defaults to R2018."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("export_dxf", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `export_dxf failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
