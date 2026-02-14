import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "$402 b0x Miner — $1 a Day | path402.com",
  description: "Run a full SPV node on the Bitcoin 402 payments network. Mine $402 tokens, run Bitcoin apps, get a secure Android device. $1/day for 365 days.",
  openGraph: {
    title: "$402 b0x Miner — $1 a Day",
    description: "Run a full SPV node. Mine $402 tokens. Bitcoin Writer, Email, Drive. Secure encrypted mesh. $1/day.",
    url: 'https://path402.com/b0x',
    siteName: '$402 Protocol',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "$402 b0x Miner — $1 a Day",
    description: "Run a full SPV node. Mine $402 tokens. Bitcoin Writer, Email, Drive. $1/day.",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
