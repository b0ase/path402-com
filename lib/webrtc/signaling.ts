export type SignalType = 'sdp-offer' | 'sdp-answer' | 'ice-candidate' | 'hangup' | 'ready';

export interface SignalMessage {
  type: SignalType;
  senderId: string;
  payload: unknown;
}

export interface Signaling {
  send: (msg: SignalMessage) => void;
  onMessage: (cb: (msg: SignalMessage) => void) => void;
  close: () => void;
  ready: Promise<void>;
}

/**
 * Polling-based signaling via /api/signal.
 * Polls every 300ms for new messages. Simple, no WebSocket dependency.
 * Messages are ephemeral (60s TTL server-side).
 */
export function createSignaling(roomId: string, senderId: string): Signaling {
  let callback: ((msg: SignalMessage) => void) | null = null;
  let lastTs = Date.now();
  let pollTimer: ReturnType<typeof setInterval> | undefined;
  let closed = false;

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/signal`
      : '/api/signal';

  async function poll() {
    if (closed || !callback) return;
    try {
      const res = await fetch(
        `${baseUrl}?room=${encodeURIComponent(roomId)}&senderId=${encodeURIComponent(senderId)}&since=${lastTs}`
      );
      if (!res.ok) return;
      const data = await res.json();
      lastTs = data.ts;
      for (const msg of data.messages) {
        callback({
          type: msg.type as SignalType,
          senderId: msg.senderId,
          payload: msg.payload,
        });
      }
    } catch {
      // Network error — skip this poll cycle
    }
  }

  // Start polling immediately
  const ready = new Promise<void>((resolve) => {
    // First poll to confirm the endpoint works, then start interval
    poll().then(() => {
      pollTimer = setInterval(poll, 300);
      resolve();
    });
  });

  return {
    send(msg: SignalMessage) {
      if (closed) return;
      fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room: roomId,
          senderId: msg.senderId,
          type: msg.type,
          payload: msg.payload,
        }),
      }).catch(() => {});
    },
    onMessage(cb) {
      callback = cb;
    },
    close() {
      closed = true;
      if (pollTimer) clearInterval(pollTimer);
    },
    ready,
  };
}
