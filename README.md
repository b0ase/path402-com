# path402.com

The official website for the **$PATH402** protocol.

## What is $PATH402?

$PATH402 is a protocol that turns any URL path into a priced, tokenised market. Put a `$` in front of a path segment and it becomes an economic object with a price curve, holders, and revenue distribution.

The name combines:
- **$PATH** — the namespace/directory concept (every `$address` is a path)
- **402** — HTTP 402 Payment Required (the response that triggers payment)

## Pages

- `/` — Homepage with protocol overview
- `/docs` — Full documentation
- `/exchange` — Token discovery and acquisition

## Ecosystem

| Component | Description | Link |
|-----------|-------------|------|
| **$PATH402** | The protocol | [path402.com](https://path402.com) |
| **path402-mcp-server** | AI agent tools | [npm](https://www.npmjs.com/package/path402-mcp-server) |
| **GitHub** | Source code | [github.com/b0ase/path402-mcp-server](https://github.com/b0ase/path402-mcp-server) |
| **Live Exchange** | Trade tokens | [b0ase.com/exchange](https://b0ase.com/exchange) |

## Quick Start

```bash
# Install the MCP server
npm install path402-mcp-server

# Add to Claude Desktop config
{
  "mcpServers": {
    "path402": {
      "command": "npx",
      "args": ["path402-mcp-server"]
    }
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Deployment

This site is deployed on Vercel at [path402.com](https://path402.com).

## License

MIT

## Contact

- Email: hello@b0ase.com
- Telegram: [t.me/b0ase_com](https://t.me/b0ase_com)
