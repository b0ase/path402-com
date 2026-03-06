import { Metadata } from 'next';
import LivePage from './LivePage';

export const metadata: Metadata = {
  title: 'LIVE — $402 Protocol',
  description:
    'Token-gated live video broadcasting. Creators stream, token holders watch. 1 tok/sec via $402 payment channels.',
};

export default function Page() {
  return <LivePage />;
}
