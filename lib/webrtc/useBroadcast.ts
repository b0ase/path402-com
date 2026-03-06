'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ICE_SERVERS } from './ice-servers';
import { createSignaling, type Signaling, type SignalMessage } from './signaling';

export type BroadcastState = 'idle' | 'preview' | 'live' | 'ended';

const MAX_VIEWERS = 8;

interface ViewerConnection {
  pc: RTCPeerConnection;
  paymentChannel: RTCDataChannel | null;
  tokensReceived: number;
}

export function useBroadcast() {
  const [broadcastState, setBroadcastState] = useState<BroadcastState>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [totalTokensReceived, setTotalTokensReceived] = useState(0);
  const [broadcastDuration, setBroadcastDuration] = useState(0);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const viewersRef = useRef(new Map<string, ViewerConnection>());
  const signalingRef = useRef<Signaling | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const senderIdRef = useRef(crypto.randomUUID());
  const roomIdRef = useRef<string>('');
  const keepaliveRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const durationRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const startTimeRef = useRef(0);
  const tokenAddressRef = useRef('');

  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  // Sync viewer count from map
  const syncViewerCount = useCallback(() => {
    const count = viewersRef.current.size;
    setViewerCount(count);
    return count;
  }, []);

  // Aggregate tokens from all viewers
  const syncTokens = useCallback(() => {
    let total = 0;
    for (const v of viewersRef.current.values()) {
      total += v.tokensReceived;
    }
    setTotalTokensReceived(total);
  }, []);

  const startPreview = useCallback(async () => {
    setMediaError(null);
    const attempts: MediaStreamConstraints[] = [
      { video: true, audio: true },
      { video: false, audio: true },
    ];
    for (const constraints of attempts) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);
        setBroadcastState('preview');
        if (!constraints.video) {
          setMediaError('No camera found — audio only');
        }
        return;
      } catch {
        // Try next fallback
      }
    }
    setMediaError('No camera or microphone found. Check device permissions.');
    setBroadcastState('preview');
  }, []);

  const addViewer = useCallback((viewerId: string) => {
    if (viewersRef.current.has(viewerId)) return;
    if (viewersRef.current.size >= MAX_VIEWERS) return;

    const stream = localStreamRef.current;
    if (!stream) return;

    const signaling = signalingRef.current;
    if (!signaling) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Add local tracks (creator's media)
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    // Create $402-payment data channel
    const dc = pc.createDataChannel('$402-payment', { ordered: true });

    const viewer: ViewerConnection = {
      pc,
      paymentChannel: null,
      tokensReceived: 0,
    };

    // Listen for payment messages on the data channel
    dc.onopen = () => {
      viewer.paymentChannel = dc;
    };
    dc.onmessage = () => {
      viewer.tokensReceived++;
      syncTokens();
    };
    dc.onclose = () => {
      viewer.paymentChannel = null;
    };

    // ICE trickle — targeted to this viewer
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        signaling.send({
          type: 'ice-candidate',
          senderId: senderIdRef.current,
          targetId: viewerId,
          payload: e.candidate.toJSON(),
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        removeViewer(viewerId);
      }
    };

    viewersRef.current.set(viewerId, viewer);
    syncViewerCount();

    // Create and send SDP offer targeted to this viewer
    (async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      signaling.send({
        type: 'sdp-offer',
        senderId: senderIdRef.current,
        targetId: viewerId,
        payload: offer,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncViewerCount, syncTokens]);

  const removeViewer = useCallback((viewerId: string) => {
    const viewer = viewersRef.current.get(viewerId);
    if (viewer) {
      viewer.pc.close();
      viewersRef.current.delete(viewerId);
      syncViewerCount();
      syncTokens();
    }
  }, [syncViewerCount, syncTokens]);

  const goLive = useCallback(
    async (roomId: string, tokenAddress: string, walletHandle: string) => {
      roomIdRef.current = roomId;
      tokenAddressRef.current = tokenAddress;
      setBroadcastState('live');

      // Register room with server
      await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-handle': walletHandle,
        },
        body: JSON.stringify({
          roomId,
          creatorId: senderIdRef.current,
          tokenAddress,
        }),
      });

      // Start signaling
      const signaling = createSignaling(roomId, senderIdRef.current);
      signalingRef.current = signaling;

      signaling.onMessage(async (msg: SignalMessage) => {
        if (msg.type === 'ready') {
          // New viewer wants to join
          addViewer(msg.senderId);
        } else if (msg.type === 'sdp-answer') {
          // Viewer answered our offer
          const viewer = viewersRef.current.get(msg.senderId);
          if (viewer) {
            await viewer.pc.setRemoteDescription(
              new RTCSessionDescription(msg.payload as RTCSessionDescriptionInit)
            );
          }
        } else if (msg.type === 'ice-candidate') {
          const viewer = viewersRef.current.get(msg.senderId);
          if (viewer) {
            try {
              await viewer.pc.addIceCandidate(
                new RTCIceCandidate(msg.payload as RTCIceCandidateInit)
              );
            } catch {
              // ICE candidate may arrive before remote description
            }
          }
        } else if (msg.type === 'hangup') {
          removeViewer(msg.senderId);
        }
      });

      await signaling.ready;

      // Room keepalive every 30s
      keepaliveRef.current = setInterval(() => {
        fetch('/api/rooms', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: roomIdRef.current,
            creatorId: senderIdRef.current,
            viewerCount: viewersRef.current.size,
          }),
        }).catch(() => {});
      }, 30_000);

      // Duration timer
      startTimeRef.current = Date.now();
      durationRef.current = setInterval(() => {
        setBroadcastDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    },
    [addViewer, removeViewer]
  );

  const endBroadcast = useCallback(() => {
    // Send broadcast-end to all viewers
    const signaling = signalingRef.current;
    if (signaling) {
      signaling.send({
        type: 'broadcast-end',
        senderId: senderIdRef.current,
        payload: null,
      });
    }

    // Close all viewer connections
    for (const [id] of viewersRef.current) {
      const viewer = viewersRef.current.get(id);
      if (viewer) viewer.pc.close();
    }
    viewersRef.current.clear();
    setViewerCount(0);

    // Stop signaling
    signalingRef.current?.close();
    signalingRef.current = null;

    // Stop keepalive + duration timers
    if (keepaliveRef.current) clearInterval(keepaliveRef.current);
    if (durationRef.current) clearInterval(durationRef.current);

    // Delete room from server
    fetch('/api/rooms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: roomIdRef.current,
        creatorId: senderIdRef.current,
      }),
    }).catch(() => {});

    // Stop media
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setBroadcastState('ended');
  }, []);

  const toggleAudio = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setAudioEnabled((prev) => !prev);
  }, []);

  const toggleVideo = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setVideoEnabled((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setBroadcastState('idle');
    setBroadcastDuration(0);
    setTotalTokensReceived(0);
    setViewerCount(0);
    setAudioEnabled(true);
    setVideoEnabled(true);
    senderIdRef.current = crypto.randomUUID();
  }, []);

  return {
    broadcastState,
    localStream,
    audioEnabled,
    videoEnabled,
    viewerCount,
    totalTokensReceived,
    broadcastDuration,
    mediaError,
    startPreview,
    goLive,
    endBroadcast,
    toggleAudio,
    toggleVideo,
    reset,
    MAX_VIEWERS,
  };
}
