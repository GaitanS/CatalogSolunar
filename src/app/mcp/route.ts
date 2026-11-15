/**
 * Public MCP server (Streamable HTTP, stateless, read-only, no auth).
 * Each POST carries one JSON-RPC message (or a batch) and gets a plain JSON answer;
 * there is no server-to-client stream, so GET answers 405 as the spec allows.
 */

import { AGENT_TOOLS, MCP_INSTRUCTIONS, MCP_PROTOCOL_VERSIONS, MCP_SERVER_INFO, runAgentTool } from '@/lib/agentApi';

export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 64 * 1024;

const COMMON_HEADERS = {
    // Public data, so any web client may call it.
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Protocol-Version, Mcp-Session-Id, Last-Event-ID',
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex',
};

type JsonRpcId = string | number | null;
type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject => typeof value === 'object' && value !== null && !Array.isArray(value);

const idOf = (message: unknown): JsonRpcId => {
    const id = isObject(message) ? message.id : null;
    return typeof id === 'string' || typeof id === 'number' ? id : null;
};

const result = (id: JsonRpcId, value: JsonObject) => ({ jsonrpc: '2.0', id, result: value });
const error = (id: JsonRpcId, code: number, message: string) => ({ jsonrpc: '2.0', id, error: { code, message } });

function json(body: unknown, status = 200) {
    return Response.json(body, { status, headers: COMMON_HEADERS });
}

/** The answer to one message, or null for notifications and client responses, which get none. */
function handle(message: unknown): JsonObject | null {
    if (!isObject(message) || message.jsonrpc !== '2.0') return error(idOf(message), -32600, 'Invalid Request');
    if (typeof message.method !== 'string') {
        return 'result' in message || 'error' in message ? null : error(idOf(message), -32600, 'Invalid Request');
    }
    if (!('id' in message)) return null;

    const id = idOf(message);
    const params = isObject(message.params) ? message.params : {};

    switch (message.method) {
        case 'initialize': {
            const requested = params.protocolVersion;
            const protocolVersion = typeof requested === 'string' && MCP_PROTOCOL_VERSIONS.includes(requested)
                ? requested
                : MCP_PROTOCOL_VERSIONS[0];
            return result(id, {
                protocolVersion,
                capabilities: { tools: { listChanged: false } },
                serverInfo: MCP_SERVER_INFO,
                instructions: MCP_INSTRUCTIONS,
            });
        }
        case 'ping':
            return result(id, {});
        case 'tools/list':
            return result(id, { tools: AGENT_TOOLS });
        case 'tools/call': {
            const name = params.name;
            const args = params.arguments ?? {};
            if (typeof name !== 'string' || !isObject(args)) return error(id, -32602, 'tools/call needs a tool name and an arguments object');
            const outcome = runAgentTool(name, args);
            if (!outcome) return error(id, -32602, `Unknown tool: ${name}`);
            if (!outcome.ok) return result(id, { content: [{ type: 'text', text: outcome.error }], isError: true });
            return result(id, {
                content: [{ type: 'text', text: JSON.stringify(outcome.data, null, 2) }],
                structuredContent: outcome.data,
            });
        }
        default:
            return error(id, -32601, `Method not found: ${message.method}`);
    }
}

export async function POST(request: Request) {
    const version = request.headers.get('mcp-protocol-version');
    if (version && !MCP_PROTOCOL_VERSIONS.includes(version)) {
        return json(error(null, -32600, `Unsupported MCP-Protocol-Version: ${version}`), 400);
    }
    if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
        return json(error(null, -32600, 'Request too large'), 413);
    }

    let message: unknown;
    try {
        message = JSON.parse(await request.text());
    } catch {
        return json(error(null, -32700, 'Parse error'), 400);
    }

    if (Array.isArray(message) && message.length === 0) return json(error(null, -32600, 'Invalid Request'), 400);
    const answers = (Array.isArray(message) ? message : [message]).map(handle).filter((answer) => answer !== null);
    if (answers.length === 0) return new Response(null, { status: 202, headers: COMMON_HEADERS });
    return json(Array.isArray(message) ? answers : answers[0]);
}

export function GET() {
    return new Response(null, { status: 405, headers: { ...COMMON_HEADERS, Allow: 'POST, OPTIONS' } });
}

export function DELETE() {
    return new Response(null, { status: 405, headers: { ...COMMON_HEADERS, Allow: 'POST, OPTIONS' } });
}

export function OPTIONS() {
    return new Response(null, { status: 204, headers: COMMON_HEADERS });
}
