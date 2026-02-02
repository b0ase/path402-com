import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { WalletProvider } from "@/components/WalletProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "$402 — The Path Token Standard",
  description: "Turn any URL into a priced, tokenised market. The protocol for AI-native micropayments on BSV.",
  openGraph: {
    title: "$402 — The Path Token Standard",
    description: "Turn any URL into a priced, tokenised market. The protocol for AI-native micropayments on BSV.",
    url: "https://path402.com",
    siteName: "$402 Protocol",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "$402 — The Path Token Standard",
    description: "Turn any URL into a priced, tokenised market.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <WalletProvider>
            <Navbar />
            {children}

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-800 py-12 mt-20 bg-gray-50 dark:bg-black">
              <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="font-bold mb-4 text-gray-900 dark:text-white">$402</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      The Path Token Standard for tokenised content and AI-native micropayments.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Resources</h4>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/docs" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Documentation</Link></li>
                      <li><Link href="/402" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Whitepaper</Link></li>
                      <li><a href="https://github.com/b0ase/path402-mcp-server" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">GitHub</a></li>
                      <li><a href="https://www.npmjs.com/package/path402-mcp-server" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">npm Package</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Ecosystem</h4>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/exchange" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Exchange</Link></li>
                      <li><Link href="/token" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Token</Link></li>
                      <li><Link href="/registry" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Registry</Link></li>
                      <li><a href="https://b0ase.com/exchange" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">b0ase.com/exchange</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Contact</h4>
                    <ul className="space-y-2 text-sm">
                      <li><a href="mailto:hello@b0ase.com" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">hello@b0ase.com</a></li>
                      <li><a href="https://t.me/b0ase_com" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Telegram</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
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
