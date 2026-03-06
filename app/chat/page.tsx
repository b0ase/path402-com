import { Metadata } from 'next';
import VideoCallPage from './VideoCallPage';

export const metadata: Metadata = {
  title: 'Video Call — $402 Protocol',
  description:
    'P2P video calls with $402 token streaming. 1 tok/sec bilateral payment channel over WebRTC.',
};

export default function Page() {
  return <VideoCallPage />;
}
