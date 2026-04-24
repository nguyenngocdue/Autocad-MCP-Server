# AutoCAD MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that lets AI assistants like GitHub Copilot interact directly with AutoCAD. Draw geometry, inspect drawings, and run custom C# code — all through natural language.

---

## Features

| Tool | Description |
|------|-------------|
| `say_hello` | Test the connection and verify the AutoCAD plugin is running |
| `get_document_info` | Get active drawing info (file name, units, extents, limits) |
| `get_layers` | List all layers in the drawing |
| `get_entities` | Query model-space entities, with optional layer/type filters |
| `create_line` | Draw a line between two points |
| `write_message` | Print a message to the AutoCAD command line |
| `send_code_to_autocad` | Execute dynamic C# code inside AutoCAD |
| `show_dialog` | Show a message dialog box in AutoCAD |

---

## Requirements

- **Node.js** >= 20
- **AutoCAD 2024** (or compatible version) with the MCP C# plugin loaded
- **VS Code** with GitHub Copilot Chat

---

## Installation

```bash
# Clone the repository
git clone https://github.com/nguyenngocdue/Autocad-MCP-Server.git
cd Autocad-MCP-Server

# Install dependencies
npm install

# Build
npm run build
```

---

## Configuration

Add the server to your VS Code `.vscode/mcp.json`:

```json
{
  "servers": {
    "autocad": {
      "type": "stdio",
      "command": "node",
      "args": ["<absolute-path-to>/build/index.js"]
    }
  }
}
```

### Environment Variables (optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `AUTOCAD_HOST` | `localhost` | AutoCAD plugin host |
| `AUTOCAD_PORT` | auto-detect `8180–8199` | AutoCAD plugin port |

---

## How It Works

```
GitHub Copilot Chat
      │  MCP (stdio)
      ▼
autocad-mcp-server (Node.js)
      │  TCP socket (port 8180–8199)
      ▼
AutoCAD C# Plugin (NETLOAD)
      │
      ▼
AutoCAD Document / Database
```

1. The MCP server starts as a `stdio` process launched by VS Code.
2. It discovers the AutoCAD plugin by scanning ports `8180–8199`.
3. Each tool sends a JSON command over the TCP socket to the C# plugin.
4. The plugin executes the command inside AutoCAD and returns the result.

---

## Usage Examples

**Draw a line:**
> "Draw a line from (0,0) to (1000,1000)"

**Get drawing info:**
> "What is the current drawing file and its units?"

**Run custom code:**
> "Count all entities in model space"

**Show a dialog:**
> "Show a dialog saying 'Hello from Copilot!'"

---

## Development

```bash
# Run in watch mode (no build needed)
npm run dev

# Build for production
npm run build

# Start built server
npm start
```

Logs are written to:
```
%APPDATA%\DeepBim-MCP-ACAD\mcp-server-startup.log
```

---

## License

MIT
