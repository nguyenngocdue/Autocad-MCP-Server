import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerSayHelloTool(server: McpServer) {
  server.tool(
    "say_hello",
    "Test connection to AutoCAD. Displays a greeting and returns the AutoCAD version info.",
    {
      message: z
        .string()
        .optional()
        .describe("Optional custom greeting message. Defaults to 'Hello MCP!'"),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("say_hello", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `say_hello failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
