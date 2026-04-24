import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerWriteMessageTool(server: McpServer) {
  server.tool(
    "write_message",
    "Write a message to the AutoCAD command line window. Useful for status updates and notifications.",
    {
      message: z.string().describe("The message text to display in the AutoCAD command line."),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("write_message", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `write_message failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
