/**
 * POST /api/mcp — Path402 MCP HTTP endpoint
 *
 * Lightweight JSON-RPC handler that exposes Path402 tool metadata.
 * For full MCP functionality, use: npx path402 (stdio transport)
 */

import { NextRequest } from 'next/server';

const TOOLS = [
  { name: 'path402_discover', description: 'Probe a $address — get pricing, supply, revenue model, and nested paths', inputSchema: { type: 'object', properties: { address: { type: 'string', description: 'The $address to discover (e.g. $b0ase.com/$blog)' } }, required: ['address'] } },
  { name: 'path402_batch_discover', description: 'Discover multiple $addresses in one call', inputSchema: { type: 'object', properties: { addresses: { type: 'array', items: { type: 'string' }, description: 'Array of $addresses to discover' } }, required: ['addresses'] } },
  { name: 'path402_evaluate', description: 'Budget check — should the agent acquire this token? Returns recommendation + ROI estimate', inputSchema: { type: 'object', properties: { address: { type: 'string' }, maxSpend: { type: 'number' } }, required: ['address'] } },
  { name: 'path402_economics', description: 'Deep financial analysis — breakeven, projections, scenarios for a $address', inputSchema: { type: 'object', properties: { address: { type: 'string' } }, required: ['address'] } },
  { name: 'path402_price_schedule', description: 'View price progression across supply levels for a token', inputSchema: { type: 'object', properties: { address: { type: 'string' } }, required: ['address'] } },
  { name: 'path402_acquire', description: 'Pay for and acquire a token — agent holds token and can serve content', inputSchema: { type: 'object', properties: { address: { type: 'string' }, amount: { type: 'number' } }, required: ['address'] } },
  { name: 'path402_wallet', description: 'View balance, holdings, net P&L, and serving revenue', inputSchema: { type: 'object', properties: {} } },
  { name: 'path402_set_budget', description: 'Configure agent spending parameters', inputSchema: { type: 'object', properties: { budget: { type: 'number' } }, required: ['budget'] } },
  { name: 'path402_serve', description: 'Distribute content you hold to other agents/users and earn revenue', inputSchema: { type: 'object', properties: { address: { type: 'string' } }, required: ['address'] } },
  { name: 'path402_servable', description: 'List all content you can serve (inventory check)', inputSchema: { type: 'object', properties: {} } },
  { name: 'path402_token_stats', description: 'On-chain token statistics for a $address', inputSchema: { type: 'object', properties: { address: { type: 'string' } }, required: ['address'] } },
  { name: 'path402_holders', description: 'List token holders for a $address', inputSchema: { type: 'object', properties: { address: { type: 'string' } }, required: ['address'] } },
  { name: 'path402_verify', description: 'Verify token ownership — check if an address holds a specific token', inputSchema: { type: 'object', properties: { address: { type: 'string' }, holder: { type: 'string' } }, required: ['address', 'holder'] } },
  { name: 'path402_connect_wallet', description: 'Connect an external BSV wallet for on-chain operations', inputSchema: { type: 'object', properties: { wif: { type: 'string' } }, required: ['wif'] } },
  { name: 'path402_mine_status', description: 'Check Proof of Indexing mining status', inputSchema: { type: 'object', properties: {} } },
  { name: 'path402_x402', description: 'x402 agent chaining — orchestrate cross-chain payments (BSV, Base, Solana, ETH)', inputSchema: { type: 'object', properties: { chain: { type: 'string' }, action: { type: 'string' } }, required: ['action'] } },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.method === 'initialize') {
      return Response.json({
        jsonrpc: '2.0',
        id: body.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: 'path402', version: '1.3.2' },
        },
      });
    }

    if (body.method === 'tools/list') {
      return Response.json({
        jsonrpc: '2.0',
        id: body.id,
        result: { tools: TOOLS },
      });
    }

    if (body.method === 'tools/call') {
      return Response.json({
        jsonrpc: '2.0',
        id: body.id,
        result: {
          content: [{ type: 'text', text: 'This HTTP endpoint exposes tool metadata for registry scanning. For full tool execution, use the stdio transport: npx path402' }],
        },
      });
    }

    return Response.json({
      jsonrpc: '2.0',
      id: body.id ?? null,
      error: { code: -32601, message: `Method not found: ${body.method}` },
    });
  } catch (error: any) {
    return Response.json(
      { jsonrpc: '2.0', error: { code: -32603, message: error.message }, id: null },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
