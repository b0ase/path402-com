import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { WalletProvider } from "@/components/WalletProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Sticky402Button } from "@/components/Sticky402Button";

const mono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://path402.com'),
  title: "$402 — The Path 402 Token Standard",
  description: "Turn any URL into a priced, tokenised market. The protocol for AI-native micropayments on BSV.",
  keywords: ["$402", "path token", "BSV", "micropayments", "AI payments", "tokenization", "HTTP 402"],
  authors: [{ name: "b0ase", url: "https://x.com/b0ase" }],
  creator: "b0ase",
  openGraph: {
    title: "$402 — The Path 402 Token Standard",
    description: "Turn any URL into a priced, tokenised market. The protocol for AI-native micropayments on BSV.",
    url: "https://path402.com",
    siteName: "$402 Protocol",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "$402 — The Path 402 Token Standard",
    description: "Turn any URL into a priced, tokenised market.",
    creator: "@b0ase",
    site: "@b0ase",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={mono.className}>
        <ThemeProvider>
          <WalletProvider>
            <Navbar />
            {children}
            <Sticky402Button />

            {/* Footer */}
            <footer className="border-t border-zinc-200 dark:border-zinc-800 py-16 mt-20 bg-white dark:bg-black">
              <div className="max-w-4xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="font-bold mb-4 text-zinc-900 dark:text-white text-sm uppercase tracking-widest">$402</h3>
                    <p className="text-zinc-500 text-sm">
                      The Path 402 Token Standard for tokenised content and AI-native micropayments.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 mb-4 uppercase tracking-widest">Resources</h4>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/docs" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Documentation</Link></li>
                      <li><Link href="/402" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Whitepaper</Link></li>
                      <li><a href="https://github.com/b0ase/path402-mcp-server" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">GitHub</a></li>
                      <li><a href="https://www.npmjs.com/package/path402-mcp-server" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">npm Package</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 mb-4 uppercase tracking-widest">Ecosystem</h4>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/exchange" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Exchange</Link></li>
                      <li><Link href="/token" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Token</Link></li>
                      <li><Link href="/registry" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Registry</Link></li>
                      <li><a href="https://b0ase.com/exchange" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">b0ase.com/exchange</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 mb-4 uppercase tracking-widest">Contact</h4>
                    <ul className="space-y-2 text-sm">
                      <li><a href="mailto:hello@b0ase.com" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">hello@b0ase.com</a></li>
                      <li><a href="https://t.me/b0ase_com" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Telegram</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 mt-12 pt-8 text-center text-zinc-400 dark:text-zinc-600 text-xs uppercase tracking-widest">
                  © 2026 b0ase. Open BSV License v4.
                </div>
              </div>
            </footer>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
