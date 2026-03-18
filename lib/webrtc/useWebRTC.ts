'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ICE_SERVERS } from './ice-servers';
import { createSignaling, type Signaling, type SignalMessage } from './signaling';
import type { ChatMessage } from '../types';

export type CallState = 'idle' | 'lobby' | 'connecting' | 'connected' | 'ended';

export function useWebRTC() {
  const [callState, setCallState] = useState<CallState>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [paymentChannel, setPaymentChannel] = useState<RTCDataChannel | null>(null);
  const [chatChannel, setChatChannel] = useState<RTCDataChannel | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const signalingRef = useRef<Signaling | null>(null);
  const senderIdRef = useRef(crypto.randomUUID());
  const localStreamRef = useRef<MediaStream | null>(null);
  const durationRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const callStartRef = useRef(0);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const hasRemoteDescRef = useRef(false);
  const roomIdRef = useRef<string | null>(null);

  // Get hc_handle from cookie
  const getHandleFromCookie = useCallback(() => {
    if (typeof document === 'undefined') return 'anonymous';
    const match = document.cookie.match(/hc_handle=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : 'anonymous';
  }, []);

  // Keep ref in sync with state for async callbacks
  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  const persistChatMessages = useCallback(async (messages: ChatMessage[]) => {
    if (messages.length === 0 || !roomIdRef.current) return;
    try {
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: roomIdRef.current,
          messages,
        }),
      });
    } catch (error) {
      console.error('Failed to persist chat messages:', error);
    }
  }, []);

  const teardown = useCallback(() => {
    if (durationRef.current) clearInterval(durationRef.current);
    pcRef.current?.close();
    pcRef.current = null;
    signalingRef.current?.close();
    signalingRef.current = null;
    hasRemoteDescRef.current = false;
    pendingCandidatesRef.current = [];
    setPaymentChannel(null);
    setChatChannel(null);
    setRemoteStream(null);
    // Persist chat messages before ending call
    setChatMessages((msgs) => {
      persistChatMessages(msgs);
      return msgs;
    });
    setCallState('ended');
  }, [persistChatMessages]);

  const addIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    const pc = pcRef.current;
    if (!pc) return;
    if (hasRemoteDescRef.current) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      pendingCandidatesRef.current.push(candidate);
    }
  }, []);

  const flushCandidates = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) return;
    hasRemoteDescRef.current = true;
    for (const c of pendingCandidatesRef.current) {
      await pc.addIceCandidate(new RTCIceCandidate(c));
    }
    pendingCandidatesRef.current = [];
  }, []);

  const startDurationTimer = useCallback(() => {
    callStartRef.current = Date.now();
    durationRef.current = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - callStartRef.current) / 1000));
    }, 1000);
  }, []);

  const setupChatChannel = useCallback((channel: RTCDataChannel) => {
    channel.onopen = () => setChatChannel(channel);
    channel.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as ChatMessage;
        setChatMessages((prev) => [...prev, msg]);
      } catch (error) {
        console.error('Failed to parse chat message:', error);
      }
    };
    channel.onerror = (error) => console.error('Chat channel error:', error);
  }, []);

  const sendChatMessage = useCallback((text: string) => {
    if (!chatChannel || chatChannel.readyState !== 'open') return;
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: getHandleFromCookie(),
      text,
      timestamp: Date.now(),
    };
    chatChannel.send(JSON.stringify(msg));
    setChatMessages((prev) => [...prev, msg]);
  }, [chatChannel, getHandleFromCookie]);

  const startPreview = useCallback(async () => {
    setMediaError(null);
    // Try video + audio first, then audio-only, then fail gracefully
    const attempts: MediaStreamConstraints[] = [
      { video: true, audio: true },
      { video: false, audio: true },
    ];
    for (const constraints of attempts) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);
        setCallState('lobby');
        if (!constraints.video) {
          setMediaError('No camera found — audio only');
        }
        return;
      } catch {
        // Try next fallback
      }
    }
    // All attempts failed — still allow lobby for receiving calls
    setMediaError('No camera or microphone found. Check device permissions.');
    setCallState('lobby');
  }, []);

  const createRoom = useCallback(
    async (roomId: string) => {
      const stream = localStreamRef.current;
      if (!stream) return;
      setCallState('connecting');
      roomIdRef.current = roomId;
      setChatMessages([]);

      const signaling = createSignaling(roomId, senderIdRef.current);
      signalingRef.current = signaling;

      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      // Set up remote stream
      const remote = new MediaStream();
      setRemoteStream(remote);
      pc.ontrack = (e) => {
        e.streams[0]?.getTracks().forEach((t) => remote.addTrack(t));
      };

      // ICE trickle
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          signaling.send({
            type: 'ice-candidate',
            senderId: senderIdRef.current,
            payload: e.candidate.toJSON(),
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setCallState('connected');
          startDurationTimer();
        } else if (
          pc.connectionState === 'failed' ||
          pc.connectionState === 'disconnected'
        ) {
          localStreamRef.current?.getTracks().forEach((t) => t.stop());
          setLocalStream(null);
          teardown();
        }
      };

      // Add local tracks
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      // Create $402-payment data channel (offerer creates it)
      const dc = pc.createDataChannel('$402-payment', { ordered: true });
      dc.onopen = () => setPaymentChannel(dc);

      // Create chat-text data channel (offerer creates it)
      const chatDc = pc.createDataChannel('chat-text', { ordered: true });
      setupChatChannel(chatDc);

      // Handle signaling messages
      signaling.onMessage(async (msg: SignalMessage) => {
        if (msg.type === 'ready') {
          // Joiner subscribed — send offer
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          signaling.send({
            type: 'sdp-offer',
            senderId: senderIdRef.current,
            payload: offer,
          });
        } else if (msg.type === 'sdp-answer') {
          await pc.setRemoteDescription(
            new RTCSessionDescription(msg.payload as RTCSessionDescriptionInit)
          );
          await flushCandidates();
        } else if (msg.type === 'ice-candidate') {
          await addIceCandidate(msg.payload as RTCIceCandidateInit);
        } else if (msg.type === 'hangup') {
          localStreamRef.current?.getTracks().forEach((t) => t.stop());
          setLocalStream(null);
          teardown();
        }
      });

      await signaling.ready;
    },
    [teardown, startDurationTimer, addIceCandidate, flushCandidates, setupChatChannel]
  );

  const joinRoom = useCallback(
    async (roomId: string) => {
      const stream = localStreamRef.current;
      if (!stream) return;
      setCallState('connecting');
      roomIdRef.current = roomId;
      setChatMessages([]);

      const signaling = createSignaling(roomId, senderIdRef.current);
      signalingRef.current = signaling;

      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      // Set up remote stream
      const remote = new MediaStream();
      setRemoteStream(remote);
      pc.ontrack = (e) => {
        e.streams[0]?.getTracks().forEach((t) => remote.addTrack(t));
      };

      // ICE trickle
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          signaling.send({
            type: 'ice-candidate',
            senderId: senderIdRef.current,
            payload: e.candidate.toJSON(),
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setCallState('connected');
          startDurationTimer();
        } else if (
          pc.connectionState === 'failed' ||
          pc.connectionState === 'disconnected'
        ) {
          localStreamRef.current?.getTracks().forEach((t) => t.stop());
          setLocalStream(null);
          teardown();
        }
      };

      // Add local tracks
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      // Answerer receives data channels
      pc.ondatachannel = (e) => {
        if (e.channel.label === '$402-payment') {
          const ch = e.channel;
          if (ch.readyState === 'open') {
            setPaymentChannel(ch);
          } else {
            ch.onopen = () => setPaymentChannel(ch);
          }
        } else if (e.channel.label === 'chat-text') {
          setupChatChannel(e.channel);
        }
      };

      // Handle signaling messages
      signaling.onMessage(async (msg: SignalMessage) => {
        if (msg.type === 'sdp-offer') {
          await pc.setRemoteDescription(
            new RTCSessionDescription(msg.payload as RTCSessionDescriptionInit)
          );
          await flushCandidates();
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          signaling.send({
            type: 'sdp-answer',
            senderId: senderIdRef.current,
            payload: answer,
          });
        } else if (msg.type === 'ice-candidate') {
          await addIceCandidate(msg.payload as RTCIceCandidateInit);
        } else if (msg.type === 'hangup') {
          localStreamRef.current?.getTracks().forEach((t) => t.stop());
          setLocalStream(null);
          teardown();
        }
      });

      await signaling.ready;
      // Tell creator we're ready to receive the offer
      signaling.send({
        type: 'ready',
        senderId: senderIdRef.current,
        payload: null,
      });
    },
    [teardown, startDurationTimer, addIceCandidate, flushCandidates, setupChatChannel]
  );

  const hangUp = useCallback(() => {
    try {
      signalingRef.current?.send({
        type: 'hangup',
        senderId: senderIdRef.current,
        payload: null,
      });
    } catch {
      // signaling may already be closed
    }
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    teardown();
  }, [teardown]);

  const toggleAudio = useCallback(() => {
    localStreamRef.current
      ?.getAudioTracks()
      .forEach((t) => {
        t.enabled = !t.enabled;
      });
    setAudioEnabled((prev) => !prev);
  }, []);

  const toggleVideo = useCallback(() => {
    localStreamRef.current
      ?.getVideoTracks()
      .forEach((t) => {
        t.enabled = !t.enabled;
      });
    setVideoEnabled((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setCallState('idle');
    setCallDuration(0);
    setAudioEnabled(true);
    setVideoEnabled(true);
    senderIdRef.current = crypto.randomUUID();
  }, []);

  return {
    callState,
    localStream,
    remoteStream,
    paymentChannel,
    chatMessages,
    audioEnabled,
    videoEnabled,
    callDuration,
    mediaError,
    startPreview,
    createRoom,
    joinRoom,
    hangUp,
    toggleAudio,
    toggleVideo,
    sendChatMessage,
    reset,
  };
}
