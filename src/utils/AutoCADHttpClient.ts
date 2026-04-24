/**
 * AutoCADHttpClient — gọi AutoCAD plugin qua HTTP thay vì TCP raw.
 *
 * Khi AUTOCAD_HTTP_URL được set (ví dụ: http://localhost:9180 hoặc
 * https://xxxx.trycloudflare.com), toàn bộ command được gửi qua HTTP POST.
 * Không cần mutex vì HTTP là stateless request/response.
 *
 * Ưu điểm:
 * - Hoạt động qua Cloudflare Tunnel, ngrok HTTP, hoặc bất kỳ HTTP proxy nào.
 * - Không cần mở TCP port ra ngoài.
 * - Dễ dàng test bằng curl / Postman.
 *
 * Port mặc định local: http://localhost:9180
 */

let autocadHttpUrl: string | undefined = process.env.AUTOCAD_HTTP_URL;
const AUTOCAD_COMMAND_TIMEOUT_MS = 120_000; // 2 phút

/** Cập nhật URL lúc runtime nếu cần */
export function setAutoCADHttpUrl(url: string): void {
  autocadHttpUrl = url;
}

export function getAutoCADHttpUrl(): string | undefined {
  return autocadHttpUrl;
}

export function isHttpMode(): boolean {
  return !!autocadHttpUrl;
}

export async function sendAutoCADCommandHttp(method: string, params: any = {}): Promise<any> {
  if (!autocadHttpUrl) {
    throw new Error("AUTOCAD_HTTP_URL is not set");
  }

  const url = autocadHttpUrl.replace(/\/$/, "");
  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const body = JSON.stringify({
    jsonrpc: "2.0",
    method,
    params,
    id: requestId,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AUTOCAD_COMMAND_TIMEOUT_MS);

  try {
    console.error(`[AutoCAD-HTTP] POST ${url} → ${method}`);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const data: any = await response.json();
    console.error(`[AutoCAD-HTTP] Response received for ${method}`);

    if (data.error) {
      throw new Error(data.error.message || "Unknown error from AutoCAD");
    }

    return data.result;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error(`AutoCAD command timed out after ${AUTOCAD_COMMAND_TIMEOUT_MS / 1000}s: ${method}`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
