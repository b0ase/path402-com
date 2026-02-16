import type { Metadata } from 'next';
import ClawMinerPage from './ClawMinerPage';

export const metadata: Metadata = {
  title: "ClawMiner — The Agentic x402 Miner | b0ase.com",
  description: "The b0x was always a distributed MCP server. The ClawMiner gives it a brain — OpenClaw AI agent, dynamic $402 mining, speculative x402 trading. An autonomous economic agent on a private encrypted mesh.",
  openGraph: {
    title: "ClawMiner — The Agentic x402 Miner",
    description: "The b0x was always a distributed MCP server. ClawMiner adds an AI agent, dynamic mining, and speculative x402 trading. $1/day on a private mesh.",
    url: 'https://b0ase.com/claw-miner',
    siteName: 'b0ase.com',
    type: 'website',
    images: [{
      url: 'https://b0ase.com/blog/claw-miner-hero.jpg',
      width: 1200,
      height: 630,
      alt: 'ClawMiner — The Agentic x402 Miner',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "ClawMiner — The Agentic x402 Miner",
    description: "AI agent. MCP server. $402 miner. Speculative x402 trading. $1/day.",
    images: ['https://b0ase.com/blog/claw-miner-hero.jpg'],
  },
};

export default function Page() {
  return <ClawMinerPage />;
}
