import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withAutoCADConnection } from "../utils/ConnectionManager.js";

export function registerSendCodeToAutoCADTool(server: McpServer) {
  server.tool(
    "send_code_to_autocad",
    "Execute dynamic C# code inside AutoCAD. The code runs in the context of the active document. " +
    "Use this for complex operations not covered by other tools. " +
    "Available namespaces: Autodesk.AutoCAD.ApplicationServices, Autodesk.AutoCAD.DatabaseServices, " +
    "Autodesk.AutoCAD.Geometry, Autodesk.AutoCAD.EditorInput. " +
    "The variable 'doc' (Document) and 'db' (Database) are pre-injected. Return a value to get output.",
    {
      code: z.string().describe(
        "C# code to execute inside AutoCAD. Example:\n" +
        "var count = 0;\nusing(var tr = db.TransactionManager.StartTransaction()) {\n" +
        "  var bt = (BlockTable)tr.GetObject(db.BlockTableId, OpenMode.ForRead);\n" +
        "  var ms = (BlockTableRecord)tr.GetObject(bt[BlockTableRecord.ModelSpace], OpenMode.ForRead);\n" +
        "  foreach(ObjectId id in ms) count++;\n  tr.Commit();\n}\nreturn count;"
      ),
    },
    async (args) => {
      try {
        const response = await withAutoCADConnection(async (client) => {
          return await client.sendCommand("send_code_to_autocad", args);
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `send_code_to_autocad failed: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
