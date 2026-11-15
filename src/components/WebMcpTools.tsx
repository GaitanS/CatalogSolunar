'use client';

import { useEffect } from 'react';
import type { AgentTool } from '@/lib/agentApi';

interface ModelContext {
    registerTool(tool: object, options?: { signal?: AbortSignal }): unknown;
}

interface ToolCallResult {
    content: { type: string; text: string }[];
    isError?: boolean;
}

/** Runs the tool on the site's MCP endpoint, so the browser and remote agents get the same answers. */
async function callTool(name: string, args: unknown): Promise<ToolCallResult> {
    const response = await fetch('/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args ?? {} } }),
    });
    const message = await response.json();
    if (message.error) throw new Error(message.error.message);
    return message.result;
}

/**
 * Offers the site's tools to AI agents running in the browser (WebMCP).
 * Normal browsers have no model context, so this does nothing for them.
 */
export default function WebMcpTools({ tools }: { tools: AgentTool[] }) {
    useEffect(() => {
        // Chrome exposes the API on document; older builds and polyfills on navigator.
        const current = (document as Document & { modelContext?: ModelContext }).modelContext;
        const modelContext = current ?? (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
        if (typeof modelContext?.registerTool !== 'function') return;

        const controller = new AbortController();
        for (const tool of tools) {
            try {
                const registration = modelContext.registerTool({
                    ...tool,
                    execute: async (args: unknown) => {
                        const result = await callTool(tool.name, args);
                        // document.modelContext takes text; the older navigator API wants the MCP result.
                        return current ? result.content.map((part) => part.text).join('\n') : result;
                    },
                }, { signal: controller.signal });
                Promise.resolve(registration).catch(() => {});
            } catch {
                // Already registered (React runs effects twice in development) or an older API shape.
            }
        }
        return () => controller.abort();
    }, [tools]);

    return null;
}
