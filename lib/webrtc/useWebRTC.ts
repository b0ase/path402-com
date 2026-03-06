'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ICE_SERVERS } from './ice-servers';
import { createSignaling, type Signaling, type SignalMessage } from './signaling';

export type CallState = 'idle' | 'lobby' | 'connecting' | 'connected' | 'ended';

export function useWebRTC() {
  const [callState, setCallState] = useState<CallState>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [paymentChannel, setPaymentChannel] = useState<RTCDataChannel | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const signalingRef = useRef<Signaling | null>(null);
  const senderIdRef = useRef(crypto.randomUUID());
  const localStreamRef = useRef<MediaStream | null>(null);
  const durationRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const callStartRef = useRef(0);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const hasRemoteDescRef = useRef(false);

  // Keep ref in sync with state for async callbacks
  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  const teardown = useCallback(() => {
    if (durationRef.current) clearInterval(durationRef.current);
    pcRef.current?.close();
    pcRef.current = null;
    signalingRef.current?.close();
    signalingRef.current = null;
    hasRemoteDescRef.current = false;
    pendingCandidatesRef.current = [];
    setPaymentChannel(null);
    setRemoteStream(null);
    setCallState('ended');
  }, []);

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

  const startPreview = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      setCallState('lobby');
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  }, []);

  const createRoom = useCallback(
    async (roomId: string) => {
      const stream = localStreamRef.current;
      if (!stream) return;
      setCallState('connecting');

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
    [teardown, startDurationTimer, addIceCandidate, flushCandidates]
  );

  const joinRoom = useCallback(
    async (roomId: string) => {
      const stream = localStreamRef.current;
      if (!stream) return;
      setCallState('connecting');

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

      // Answerer receives data channel
      pc.ondatachannel = (e) => {
        if (e.channel.label === '$402-payment') {
          const ch = e.channel;
          if (ch.readyState === 'open') {
            setPaymentChannel(ch);
          } else {
            ch.onopen = () => setPaymentChannel(ch);
          }
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
    [teardown, startDurationTimer, addIceCandidate, flushCandidates]
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
    audioEnabled,
    videoEnabled,
    callDuration,
    startPreview,
    createRoom,
    joinRoom,
    hangUp,
    toggleAudio,
    toggleVideo,
    reset,
  };
}
