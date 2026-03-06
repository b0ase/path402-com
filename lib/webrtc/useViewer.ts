'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ICE_SERVERS } from './ice-servers';
import { createSignaling, type Signaling, type SignalMessage } from './signaling';

export type ViewerState = 'idle' | 'checking' | 'joining' | 'connected' | 'ended' | 'denied';

interface DeniedInfo {
  tokenAddress: string;
  tokenName: string;
  message: string;
}

export function useViewer() {
  const [viewerState, setViewerState] = useState<ViewerState>('idle');
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [tokensSent, setTokensSent] = useState(0);
  const [viewDuration, setViewDuration] = useState(0);
  const [deniedInfo, setDeniedInfo] = useState<DeniedInfo | null>(null);
  const [creatorHandle, setCreatorHandle] = useState('');
  const [tokenName, setTokenName] = useState('');

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const signalingRef = useRef<Signaling | null>(null);
  const senderIdRef = useRef(crypto.randomUUID());
  const durationRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const paymentRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const startTimeRef = useRef(0);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const hasRemoteDescRef = useRef(false);

  const teardown = useCallback(() => {
    if (durationRef.current) clearInterval(durationRef.current);
    if (paymentRef.current) clearInterval(paymentRef.current);
    pcRef.current?.close();
    pcRef.current = null;
    signalingRef.current?.close();
    signalingRef.current = null;
    hasRemoteDescRef.current = false;
    pendingCandidatesRef.current = [];
    setRemoteStream(null);
  }, []);

  const joinBroadcast = useCallback(
    async (roomId: string, walletHandle: string, walletProvider: string) => {
      setViewerState('checking');

      // Token gate check
      const gateRes = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-handle': walletHandle,
          'x-wallet-provider': walletProvider,
        },
        body: JSON.stringify({ roomId }),
      });

      if (gateRes.status === 402) {
        const data = await gateRes.json();
        setDeniedInfo({
          tokenAddress: data.tokenAddress,
          tokenName: data.tokenName,
          message: data.message,
        });
        setViewerState('denied');
        return;
      }

      if (!gateRes.ok) {
        setViewerState('idle');
        return;
      }

      const { room } = await gateRes.json();
      setCreatorHandle(room.creatorHandle);
      setTokenName(room.tokenName);
      setViewerState('joining');

      // Create peer connection — receive only (no getUserMedia)
      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      // Set up remote stream
      const remote = new MediaStream();
      setRemoteStream(remote);
      pc.ontrack = (e) => {
        e.streams[0]?.getTracks().forEach((t) => remote.addTrack(t));
      };

      // Start signaling
      const signaling = createSignaling(roomId, senderIdRef.current);
      signalingRef.current = signaling;

      // ICE trickle — targeted back to creator
      let creatorId = '';
      pc.onicecandidate = (e) => {
        if (e.candidate && creatorId) {
          signaling.send({
            type: 'ice-candidate',
            senderId: senderIdRef.current,
            targetId: creatorId,
            payload: e.candidate.toJSON(),
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setViewerState('connected');
          // Start duration timer
          startTimeRef.current = Date.now();
          durationRef.current = setInterval(() => {
            setViewDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
          }, 1000);
        } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          teardown();
          setViewerState('ended');
        }
      };

      // Handle $402-payment data channel from creator
      pc.ondatachannel = (e) => {
        if (e.channel.label === '$402-payment') {
          const ch = e.channel;
          const startPayment = () => {
            // Send 1 tok/sec to creator
            let seq = 0;
            paymentRef.current = setInterval(() => {
              seq++;
              try {
                ch.send(JSON.stringify({
                  seq,
                  timestamp: Date.now(),
                  token_path: '$402/live',
                  amount: 1,
                }));
                setTokensSent((prev) => prev + 1);
              } catch {
                // channel may have closed
              }
            }, 1000);
          };
          if (ch.readyState === 'open') {
            startPayment();
          } else {
            ch.addEventListener('open', startPayment);
          }
          ch.addEventListener('close', () => {
            if (paymentRef.current) clearInterval(paymentRef.current);
          });
        }
      };

      // Handle signaling messages
      signaling.onMessage(async (msg: SignalMessage) => {
        if (msg.type === 'sdp-offer') {
          creatorId = msg.senderId;
          await pc.setRemoteDescription(
            new RTCSessionDescription(msg.payload as RTCSessionDescriptionInit)
          );
          hasRemoteDescRef.current = true;
          // Flush pending candidates
          for (const c of pendingCandidatesRef.current) {
            await pc.addIceCandidate(new RTCIceCandidate(c));
          }
          pendingCandidatesRef.current = [];
          // Create and send answer
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          signaling.send({
            type: 'sdp-answer',
            senderId: senderIdRef.current,
            targetId: creatorId,
            payload: answer,
          });
        } else if (msg.type === 'ice-candidate') {
          if (hasRemoteDescRef.current) {
            await pc.addIceCandidate(new RTCIceCandidate(msg.payload as RTCIceCandidateInit));
          } else {
            pendingCandidatesRef.current.push(msg.payload as RTCIceCandidateInit);
          }
        } else if (msg.type === 'broadcast-end') {
          teardown();
          setViewerState('ended');
        }
      });

      await signaling.ready;

      // Tell creator we're ready
      signaling.send({
        type: 'ready',
        senderId: senderIdRef.current,
        payload: null,
      });
    },
    [teardown]
  );

  const leaveBroadcast = useCallback(() => {
    try {
      signalingRef.current?.send({
        type: 'hangup',
        senderId: senderIdRef.current,
        payload: null,
      });
    } catch {
      // signaling may already be closed
    }
    teardown();
    setViewerState('ended');
  }, [teardown]);

  const reset = useCallback(() => {
    setViewerState('idle');
    setViewDuration(0);
    setTokensSent(0);
    setDeniedInfo(null);
    setCreatorHandle('');
    setTokenName('');
    senderIdRef.current = crypto.randomUUID();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationRef.current) clearInterval(durationRef.current);
      if (paymentRef.current) clearInterval(paymentRef.current);
      pcRef.current?.close();
      signalingRef.current?.close();
    };
  }, []);

  return {
    viewerState,
    remoteStream,
    tokensSent,
    viewDuration,
    deniedInfo,
    creatorHandle,
    tokenName,
    joinBroadcast,
    leaveBroadcast,
    reset,
  };
}
