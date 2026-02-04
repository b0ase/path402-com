'use client';

import Link from "next/link";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const GITHUB_RELEASE = "https://github.com/b0ase/path402/releases/tag/%24402";

const DOWNLOADS = [
  {
    platform: "macOS",
    subtitle: "Apple Silicon",
    filename: "Path402.Client-1.3.1-arm64.dmg",
    url: "https://github.com/b0ase/path402/releases/download/%24402/Path402.Client-1.3.1-arm64.dmg",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    note: "For M1, M2, M3, M4 Macs"
  },
  {
    platform: "macOS",
    subtitle: "Intel",
    filename: "Path402.Client-1.3.1.dmg",
    url: "https://github.com/b0ase/path402/releases/download/%24402/Path402.Client-1.3.1.dmg",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    note: "For Intel-based Macs"
  },
  {
    platform: "Windows",
    subtitle: "Coming Soon",
    filename: null,
    url: null,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91V13.1l10 .15z"/>
      </svg>
    ),
    note: "Windows build in progress"
  },
  {
    platform: "Linux",
    subtitle: "Coming Soon",
    filename: null,
    url: null,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.002c-.06.135-.19.334-.472.534-.085.06-.197.117-.265.067-.08-.06-.06-.2-.044-.333.005-.03.01-.063.014-.1-.18.135-.396.2-.578.201-.203.002-.38-.064-.413-.267-.038-.135.026-.198.099-.266.075-.064.164-.132.144-.2-.022-.133-.133-.2-.233-.333a.68.68 0 01-.085-.136.844.844 0 00-.2-.2c-.024-.028-.05-.061-.073-.092l-.091.04c.009.032.019.064.028.097.016.066.024.131.045.198.063.262.135.467.27.659.105.135.226.2.39.27a.8.8 0 01-.207.533c-.128.2-.396.338-.59.469a.705.705 0 00-.282.4c-.024.135.025.266.1.4.066.133.144.266.118.469-.025.135-.131.265-.333.333-.2.066-.467.066-.699-.067a1.28 1.28 0 01-.423-.268.9.9 0 00-.148-.135c-.083-.064-.186-.131-.252-.2l-.002-.003c-.21-.2-.51-.335-.659-.601-.133-.2-.065-.4.05-.6.112-.2.214-.335.133-.468-.071-.135-.265-.201-.4-.201-.14 0-.271.065-.379.135-.107.065-.186.2-.282.333-.081.133-.216.265-.452.4-.233.135-.575.133-.789-.068a.976.976 0 01-.198-.2c-.065-.2-.015-.333.102-.468.12-.135.27-.2.33-.333.063-.134.002-.266-.102-.466a1.077 1.077 0 00-.367-.467c-.156-.066-.267-.066-.4-.2-.136-.134-.137-.334-.057-.601.07-.2.198-.334.263-.534.067-.135.002-.266-.134-.4-.136-.133-.268-.2-.4-.333-.13-.136-.263-.267-.063-.4.2-.135.398-.2.595-.133.198.066.396.2.528.4.131.134.263.2.33.265.065.066.062.068.128.068.067 0 .135.006.2-.061.067-.068.2-.2.067-.4-.13-.2-.333-.333-.465-.6a1.065 1.065 0 01-.128-.534 1.473 1.473 0 01.165-.8c.05-.066.097-.131.145-.2.063-.066.118-.132.225-.2-.104-.268-.093-.4.103-.602.07-.066.188-.133.356-.2a1.3 1.3 0 01.432-.133c-.09-.135-.168-.268-.204-.402a.853.853 0 01.03-.532c.035-.133.106-.201.133-.333l-.001.001c-.074-.135-.2-.2-.333-.135a.716.716 0 00-.267.201c-.065.067-.13.135-.196.2-.065.066-.13.135-.232.133-.067-.003-.067-.067-.032-.136.033-.066.098-.132.131-.198.065-.133.157-.268.093-.4-.062-.135-.198-.2-.33-.2H8.88c-.067 0-.201.002-.267.067-.067.066-.134.132-.067.268.066.135.135.135.267.268.132.133.296.268.33.535.036.202-.063.335-.16.468-.1.133-.196.2-.163.333.036.133.163.201.33.201h.005c.135 0 .201-.067.268-.134l.199-.202c.065-.066.13-.133.262-.133.136.002.202.068.202.201v.005c0 .135-.067.2-.135.333-.136.198-.336.468-.468.734-.13.268-.227.602-.09.936.136.333.465.537.86.6.396.068.858-.065 1.294-.265.336-.2.737-.6 1.069-.6h.002z"/>
      </svg>
    ),
    note: "Linux build in progress"
  }
];

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white font-mono">
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 mb-8"
              variants={fadeIn}
            >
              VERSION 1.3.1
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4"
              variants={fadeIn}
            >
              Download
            </motion.h1>

            <motion.p
              className="text-zinc-600 dark:text-zinc-400 max-w-2xl mb-12"
              variants={fadeIn}
            >
              Get the $402 Desktop Client. Run your own node, mint tokens, and participate in the network.
            </motion.p>

            {/* Download Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {DOWNLOADS.map((download, i) => (
                <motion.div
                  key={i}
                  className={`border p-8 ${
                    download.url
                      ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600'
                      : 'border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/50 opacity-60'
                  } transition-colors`}
                  variants={fadeIn}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-zinc-400 dark:text-zinc-600">
                      {download.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-tight">
                        {download.platform}
                      </h3>
                      <p className="text-sm text-zinc-500">{download.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 mb-6">{download.note}</p>

                  {download.url ? (
                    <a
                      href={download.url}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors w-full justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download DMG
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-widest text-xs w-full justify-center cursor-not-allowed">
                      Coming Soon
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Installation Note */}
            <motion.div
              className="border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-6 mb-12"
              variants={fadeIn}
            >
              <h3 className="text-sm font-bold uppercase tracking-wide mb-2 text-amber-800 dark:text-amber-400">
                macOS Installation Note
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-500">
                The app is not code-signed. On first launch, right-click the app and select &quot;Open&quot; to bypass Gatekeeper.
                You may also need to allow it in System Settings → Privacy & Security.
              </p>
            </motion.div>

            {/* Alternative: npm */}
            <motion.div
              className="border border-zinc-200 dark:border-zinc-800 p-8 bg-zinc-50 dark:bg-zinc-950"
              variants={fadeIn}
            >
              <h3 className="text-sm font-bold uppercase tracking-wide mb-4">
                Or install via npm
              </h3>
              <pre className="bg-white dark:bg-black p-4 font-mono text-sm text-zinc-600 dark:text-zinc-400 overflow-x-auto border border-zinc-200 dark:border-zinc-800 mb-4">
                npm install -g path402
              </pre>
              <p className="text-xs text-zinc-500">
                The npm package includes the daemon, CLI, and MCP server. Run <code className="bg-zinc-200 dark:bg-zinc-800 px-1">path402d start</code> to launch.
              </p>
            </motion.div>

            {/* Links */}
            <motion.div
              className="flex flex-wrap gap-4 mt-8"
              variants={fadeIn}
            >
              <a
                href={GITHUB_RELEASE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                View on GitHub
              </a>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Documentation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
