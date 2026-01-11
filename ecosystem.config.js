module.exports = {
    apps: [
        {
            name: 'solunar-app',
            script: 'server.js', // Needs to be copied from .next/standalone/server.js in production workflow or handle locally
            // Actually for standalone we run 'node server.js' inside the standalone folder.
            // But typically we deploy the whole repo or the standalone folder.
            // Let's assume standard Next.js deployment: 'npm start' or via 'node .next/standalone/server.js'

            // Better approach for Hostinger VPS with standalone output:
            // script: 'node',
            // args: '.next/standalone/server.js',
            // But the file path depends on where it is run.

            // Let's use the standard "npm start" for ease if not using standalone strictly, 
            // OR direct node command if using standalone.

            // User asked for standalone in next.config.js.
            // The standalone build produces a 'server.js' in '.next/standalone'.
            // We should point PM2 there.

            script: '.next/standalone/server.js',
            cwd: './', // Run from project root
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3500, // as requested
                HOSTNAME: '0.0.0.0'
            },
        },
    ],
};
