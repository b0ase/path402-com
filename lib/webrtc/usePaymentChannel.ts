'use client';

import { useEffect, useRef, useState } from 'react';

interface PaymentMessage {
  seq: number;
  timestamp: number;
  token_path: string;
  amount: number;
}

export function usePaymentChannel(channel: RTCDataChannel | null) {
  const [tokensSent, setTokensSent] = useState(0);
  const [tokensReceived, setTokensReceived] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const seqRef = useRef(0);

  useEffect(() => {
    if (!channel) return;

    const startStreaming = () => {
      setIsStreaming(true);
      intervalRef.current = setInterval(() => {
        seqRef.current++;
        const msg: PaymentMessage = {
          seq: seqRef.current,
          timestamp: Date.now(),
          token_path: '$402/video',
          amount: 1,
        };
        try {
          channel.send(JSON.stringify(msg));
          setTokensSent((prev) => prev + 1);
        } catch {
          // channel may have closed
        }
      }, 1000);
    };

    const onMessage = (e: MessageEvent) => {
      try {
        JSON.parse(e.data as string);
        setTokensReceived((prev) => prev + 1);
      } catch {
        // ignore non-JSON messages
      }
    };

    const onClose = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsStreaming(false);
    };

    if (channel.readyState === 'open') {
      startStreaming();
    } else {
      channel.addEventListener('open', startStreaming);
    }
    channel.addEventListener('message', onMessage);
    channel.addEventListener('close', onClose);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      channel.removeEventListener('open', startStreaming);
      channel.removeEventListener('message', onMessage);
      channel.removeEventListener('close', onClose);
    };
  }, [channel]);

  return { tokensSent, tokensReceived, isStreaming };
}
