import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { WalletProvider } from "@/components/WalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "$PATH402.com — Tokenised Content Protocol",
  description: "Turn any URL into a priced, tokenised market. The protocol for AI-native micropayments.",
  openGraph: {
    title: "$PATH402.com — Tokenised Content Protocol",
    description: "Turn any URL into a priced, tokenised market. The protocol for AI-native micropayments.",
    url: "https://path402.com",
    siteName: "$PATH402.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "$PATH402.com — Tokenised Content Protocol",
    description: "Turn any URL into a priced, tokenised market.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              $PATH402
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/docs" className="text-gray-400 hover:text-white transition-colors text-sm">
                Docs
              </Link>
              <Link href="/exchange" className="text-gray-400 hover:text-white transition-colors text-sm">
                Exchange
              </Link>
              <Link href="/token" className="text-gray-400 hover:text-white transition-colors text-sm">
                Token
              </Link>
              <Link href="/registry" className="text-gray-400 hover:text-white transition-colors text-sm">
                Registry
              </Link>
              <a
                href="https://github.com/b0ase/path402-mcp-server"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/path402-mcp-server"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                npm install
              </a>
            </div>
          </div>
        </nav>

        {children}

        {/* Footer */}
        <footer className="border-t border-gray-800 py-12 mt-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-4">$PATH402</h3>
                <p className="text-gray-400 text-sm">
                  The protocol for tokenised content and AI-native micropayments.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/docs" className="text-gray-400 hover:text-white">Documentation</Link></li>
                  <li><a href="https://github.com/b0ase/path402-mcp-server" className="text-gray-400 hover:text-white">GitHub</a></li>
                  <li><a href="https://www.npmjs.com/package/path402-mcp-server" className="text-gray-400 hover:text-white">npm Package</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Ecosystem</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/exchange" className="text-gray-400 hover:text-white">Exchange</Link></li>
                  <li><Link href="/token" className="text-gray-400 hover:text-white">Token</Link></li>
                  <li><Link href="/registry" className="text-gray-400 hover:text-white">Registry</Link></li>
                  <li><a href="https://b0ase.com/exchange" className="text-gray-400 hover:text-white">b0ase.com/exchange</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Contact</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="mailto:hello@b0ase.com" className="text-gray-400 hover:text-white">hello@b0ase.com</a></li>
                  <li><a href="https://t.me/b0ase_com" className="text-gray-400 hover:text-white">Telegram</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
              © 2026 b0ase. MIT License.
            </div>
          </div>
        </footer>
        </WalletProvider>
      </body>
    </html>
  );
}
