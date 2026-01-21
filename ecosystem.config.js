module.exports = {
    apps: [
        {
            name: 'solunar',
            script: 'npm',
            args: 'start -- -p 3500',
            cwd: '/var/www/solunar',
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            watch: false,
            max_memory_restart: '512M',

            // Environment
            env: {
                NODE_ENV: 'production',
                PORT: 3500,
                HOSTNAME: '127.0.0.1',  // Security: Only localhost (nginx proxies public traffic)
            },

            // Logging
            error_file: '/var/log/pm2/solunar-error.log',
            out_file: '/var/log/pm2/solunar-out.log',
            log_file: '/var/log/pm2/solunar-combined.log',
            time: true,

            // Resource limits
            node_args: [
                '--max-old-space-size=512',
            ],

            // Restart settings
            kill_timeout: 5000,
            restart_delay: 1000,
            max_restarts: 10,
            min_uptime: '10s',
        },
    ],
};
