#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools/register.js";
import { appendFileSync, mkdirSync } from "fs";
import { join } from "path";

const LOG_DIR = join(process.env["APPDATA"] ?? "C:\\Users\\Public", "DeepBim-MCP-ACAD");
const LOG_FILE = join(LOG_DIR, "mcp-server-startup.log");

function log(msg: string) {
  try {
    mkdirSync(LOG_DIR, { recursive: true });
    appendFileSync(LOG_FILE, `${new Date().toISOString()} ${msg}\n`);
  } catch { /* ignore log errors */ }
}

process.on("uncaughtException", (err) => {
  log(`UNCAUGHT: ${err.message}\n${err.stack}`);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  log(`UNHANDLED REJECTION: ${reason}`);
});

log("=== AutoCAD MCP Server starting ===");
log(`Node version: ${process.version}  CWD: ${process.cwd()}`);

const server = new McpServer({
  name: "autocad-mcp-server",
  version: "1.0.0",
});

registerTools(server);
log("Tools registered OK");

const transport = new StdioServerTransport();
log("Connecting transport...");
await server.connect(transport);
log("Transport connected - server ready");
