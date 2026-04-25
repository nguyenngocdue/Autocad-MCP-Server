import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSayHelloTool } from "./say_hello.js";
import { registerGetDocumentInfoTool } from "./get_document_info.js";
import { registerGetLayersTool } from "./get_layers.js";
import { registerGetEntitiesTool } from "./get_entities.js";
import { registerCreateLineTool } from "./create_line.js";
import { registerWriteMessageTool } from "./write_message.js";
import { registerSendCodeToAutoCADTool } from "./send_code_to_autocad.js";
import { registerShowDialogTool } from "./show_dialog.js";
// Layer management
import { registerCreateLayerTool } from "./create_layer.js";
import { registerSetCurrentLayerTool } from "./set_current_layer.js";
import { registerDeleteLayerTool } from "./delete_layer.js";
import { registerSetLayerVisibilityTool } from "./set_layer_visibility.js";
// Drawing / geometry creation
import { registerCreateCircleTool } from "./create_circle.js";
import { registerCreateRectangleTool } from "./create_rectangle.js";
import { registerCreatePolylineTool } from "./create_polyline.js";
import { registerCreateArcTool } from "./create_arc.js";
import { registerCreateTextTool } from "./create_text.js";
// Entity editing
import { registerMoveEntityTool } from "./move_entity.js";
import { registerCopyEntityTool } from "./copy_entity.js";
import { registerRotateEntityTool } from "./rotate_entity.js";
import { registerScaleEntityTool } from "./scale_entity.js";
import { registerDeleteEntityTool } from "./delete_entity.js";
import { registerMirrorEntityTool } from "./mirror_entity.js";
// Query / measurement
import { registerGetEntityPropertiesTool } from "./get_entity_properties.js";
import { registerMeasureDistanceTool } from "./measure_distance.js";
import { registerMeasureAreaTool } from "./measure_area.js";
import { registerGetBoundingBoxTool } from "./get_bounding_box.js";
// Blocks
import { registerInsertBlockTool } from "./insert_block.js";
import { registerGetBlocksTool } from "./get_blocks.js";
import { registerExplodeBlockTool } from "./explode_block.js";
// Export / view
import { registerExportPdfTool } from "./export_pdf.js";
import { registerExportDxfTool } from "./export_dxf.js";
import { registerZoomExtentsTool } from "./zoom_extents.js";

export function registerTools(server: McpServer) {
  // Original tools
  registerSayHelloTool(server);
  registerGetDocumentInfoTool(server);
  registerGetLayersTool(server);
  registerGetEntitiesTool(server);
  registerCreateLineTool(server);
  registerWriteMessageTool(server);
  registerSendCodeToAutoCADTool(server);
  registerShowDialogTool(server);
  // Layer management
  registerCreateLayerTool(server);
  registerSetCurrentLayerTool(server);
  registerDeleteLayerTool(server);
  registerSetLayerVisibilityTool(server);
  // Drawing / geometry creation
  registerCreateCircleTool(server);
  registerCreateRectangleTool(server);
  registerCreatePolylineTool(server);
  registerCreateArcTool(server);
  registerCreateTextTool(server);
  // Entity editing
  registerMoveEntityTool(server);
  registerCopyEntityTool(server);
  registerRotateEntityTool(server);
  registerScaleEntityTool(server);
  registerDeleteEntityTool(server);
  registerMirrorEntityTool(server);
  // Query / measurement
  registerGetEntityPropertiesTool(server);
  registerMeasureDistanceTool(server);
  registerMeasureAreaTool(server);
  registerGetBoundingBoxTool(server);
  // Blocks
  registerInsertBlockTool(server);
  registerGetBlocksTool(server);
  registerExplodeBlockTool(server);
  // Export / view
  registerExportPdfTool(server);
  registerExportDxfTool(server);
  registerZoomExtentsTool(server);
}
