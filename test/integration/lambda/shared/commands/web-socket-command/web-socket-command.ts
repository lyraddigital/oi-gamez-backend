import WebSocket from "ws";

export class WebSocketCommand {
  private websocket: WebSocket;

  constructor(private baseUrl: string) {}

  public connect(sessionId?: string): Promise<{ connected: boolean }> {
    const connectPromise = new Promise<{ connected: boolean }>(
      (resolve, reject) => {
        this.websocket = new WebSocket(
          `${this.baseUrl}?sessionId=${sessionId}`
        );
        this.websocket.on("error", (e) => {
          reject(e.message);
        });
        this.websocket.on("open", () => resolve({ connected: true }));
        this.websocket.on("closed", () => resolve({ connected: false }));
      }
    );

    return connectPromise;
  }

  public disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
    }
  }
}
