/** MCP Server Card (SEP-1649): lets agents find /mcp without connecting first. */

import { AGENT_TOOLS, MCP_INSTRUCTIONS, MCP_PROTOCOL_VERSIONS, MCP_SERVER_INFO, SITE_URL } from '@/lib/agentApi';

export const dynamic = 'force-static';

export function GET() {
    const endpoint = `${SITE_URL}/mcp`;

    return Response.json({
        serverInfo: MCP_SERVER_INFO,
        description: 'Solunar fishing calendar for Romania: day ratings, major and minor periods, moon phases, sun and moon times.',
        iconUrl: `${SITE_URL}/logo.png`,
        websiteUrl: SITE_URL,
        documentationUrl: `${SITE_URL}/llms.txt`,
        protocolVersions: MCP_PROTOCOL_VERSIONS,
        endpoint,
        transport: { type: 'streamable-http', endpoint },
        capabilities: { tools: { listChanged: false } },
        authentication: { required: false },
        instructions: MCP_INSTRUCTIONS,
        tools: AGENT_TOOLS.map(({ name, title, description }) => ({ name, title, description })),
    });
}
