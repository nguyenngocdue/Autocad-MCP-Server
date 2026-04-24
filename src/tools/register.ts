import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSayHelloTool } from "./say_hello.js";
import { registerGetDocumentInfoTool } from "./get_document_info.js";
import { registerGetLayersTool } from "./get_layers.js";
import { registerGetEntitiesTool } from "./get_entities.js";
import { registerCreateLineTool } from "./create_line.js";
import { registerWriteMessageTool } from "./write_message.js";
import { registerSendCodeToAutoCADTool } from "./send_code_to_autocad.js";
import { registerShowDialogTool } from "./show_dialog.js";

export function registerTools(server: McpServer) {
  registerSayHelloTool(server);
  registerGetDocumentInfoTool(server);
  registerGetLayersTool(server);
  registerGetEntitiesTool(server);
  registerCreateLineTool(server);
  registerWriteMessageTool(server);
  registerSendCodeToAutoCADTool(server);
  registerShowDialogTool(server);
}
