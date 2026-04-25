import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerExportPdfTool(server: McpServer) {
  server.tool(
    "export_pdf",
    "Export the current AutoCAD drawing to a PDF file using the default page setup.",
    {
      outputPath: z.string().describe("Full file path for the output PDF, e.g. 'C:\\\\Temp\\\\drawing.pdf'."),
      layout: z.string().optional().describe("Layout (paper space) name to export. Defaults to current layout."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("export_pdf", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `export_pdf failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
