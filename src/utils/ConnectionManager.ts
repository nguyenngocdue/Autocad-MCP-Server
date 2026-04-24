import { AutoCADClientConnection } from "./SocketClient.js";
import { isHttpMode, sendAutoCADCommandHttp } from "./AutoCADHttpClient.js";
import * as net from "net";

let connectionMutex: Promise<void> = Promise.resolve();

const PORT_START = 8180;
const PORT_END = 8199;

const AUTOCAD_HOST_OVERRIDE = process.env.AUTOCAD_HOST;
const AUTOCAD_PORT_OVERRIDE = process.env.AUTOCAD_PORT
  ? parseInt(process.env.AUTOCAD_PORT, 10)
  : undefined;

async function findAutoCADPort(): Promise<number> {
  for (let port = PORT_START; port <= PORT_END; port++) {
    const isOpen = await new Promise<boolean>((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(300);
      socket.on("connect", () => {
        socket.destroy();
        resolve(true);
      });
      socket.on("timeout", () => {
        socket.destroy();
        resolve(false);
      });
      socket.on("error", () => {
        socket.destroy();
        resolve(false);
      });
      socket.connect(port, "localhost");
    });
    if (isOpen) return port;
  }
  throw new Error(
    `No AutoCAD MCP plugin found on ports ${PORT_START}-${PORT_END}. ` +
    `Make sure AutoCAD is running and the plugin is loaded (NETLOAD), then run MCPSTART.`
  );
}

export async function withAutoCADConnection<T>(
  operation: (client: AutoCADClientConnection) => Promise<T>
): Promise<T> {
  // HTTP mode — khi AUTOCAD_HTTP_URL được set (dùng Cloudflare Tunnel, ngrok HTTP, hoặc localhost:9180)
  if (isHttpMode()) {
    const httpClient = {
      sendCommand: (method: string, params: any = {}) =>
        sendAutoCADCommandHttp(method, params),
    } as any;
    return operation(httpClient);
  }

  // TCP mode — kết nối trực tiếp local hoặc ngrok TCP tunnel
  const previousMutex = connectionMutex;
  let releaseMutex!: () => void;
  connectionMutex = new Promise<void>((resolve) => {
    releaseMutex = resolve;
  });
  await previousMutex;

  const host = AUTOCAD_HOST_OVERRIDE ?? "localhost";
  const port = AUTOCAD_PORT_OVERRIDE ?? (await findAutoCADPort());
  console.error(`[AutoCAD] Connecting to ${host}:${port}`);
  const client = new AutoCADClientConnection(host, port);

  try {
    if (!client.isConnected) {
      await new Promise<void>((resolve, reject) => {
        const onConnect = () => {
          console.error(`[AutoCAD] TCP connected to ${host}:${port}`);
          client.socket.removeListener("connect", onConnect);
          client.socket.removeListener("error", onError);
          resolve();
        };

        const onError = (error: any) => {
          client.socket.removeListener("connect", onConnect);
          client.socket.removeListener("error", onError);
          reject(new Error(`Failed to connect to AutoCAD plugin: ${error.message}`));
        };

        client.socket.on("connect", onConnect);
        client.socket.on("error", onError);
        client.connect();

        setTimeout(() => {
          client.socket.removeListener("connect", onConnect);
          client.socket.removeListener("error", onError);
          reject(new Error("Connection to AutoCAD timed out after 5s"));
        }, 5000);
      });
    }

    const result = await operation(client);
    return result;
  } finally {
    client.disconnect();
    releaseMutex();
  }
}
