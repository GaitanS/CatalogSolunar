# VPS Security Hardening Guide for calendarsolunar.ro

## Post-Compromise Recovery Checklist

After a crypto miner compromise, this guide provides comprehensive security hardening for your Ubuntu VPS.

**VPS Details:**
- IP: 185.224.139.191
- Domain: calendarsolunar.ro
- Application: Next.js on port 3500 with PM2
- Web Server: Nginx with SSL

---

## Table of Contents

1. [Initial Setup and User Security](#1-initial-setup-and-user-security)
2. [SSH Hardening](#2-ssh-hardening)
3. [Firewall Configuration (UFW)](#3-firewall-configuration-ufw)
4. [Fail2ban for Brute-Force Protection](#4-fail2ban-for-brute-force-protection)
5. [System Hardening](#5-system-hardening)
6. [Node.js/npm Security](#6-nodejsnpm-security)
7. [Nginx Security Configuration](#7-nginx-security-configuration)
8. [File Integrity Monitoring](#8-file-integrity-monitoring)
9. [Log Monitoring and Alerting](#9-log-monitoring-and-alerting)
10. [Rootkit Detection](#10-rootkit-detection)
11. [Automated Security Audit Scripts](#11-automated-security-audit-scripts)
12. [Deployment Security](#12-deployment-security)

---

## 1. Initial Setup and User Security

### 1.1 Update System Immediately

```bash
# Update package lists and upgrade all packages
sudo apt update && sudo apt upgrade -y

# Install essential security tools
sudo apt install -y \
    ufw \
    fail2ban \
    unattended-upgrades \
    apt-listchanges \
    logwatch \
    rkhunter \
    chkrootkit \
    aide \
    auditd \
    acct \
    sysstat \
    htop \
    net-tools \
    curl \
    gnupg2
```

### 1.2 Create Non-Root User with Sudo

```bash
# Create a new user (replace 'solunar' with your username)
sudo adduser solunar

# Add user to sudo group
sudo usermod -aG sudo solunar

# Test sudo access (switch to new user)
su - solunar
sudo whoami  # Should output 'root'
```

### 1.3 Secure Root Account

```bash
# Disable root login via password (keep sudo access)
sudo passwd -l root

# Remove root's password entirely (optional, more secure)
# sudo passwd -d root
```

---

## 2. SSH Hardening

### 2.1 Generate SSH Key Pair (On Your Local Machine)

```bash
# On your LOCAL Windows machine (PowerShell or Git Bash)
ssh-keygen -t ed25519 -a 100 -C "solunar-vps-key"

# This creates:
# - Private key: C:\Users\Silviu\.ssh\id_ed25519
# - Public key: C:\Users\Silviu\.ssh\id_ed25519.pub
```

### 2.2 Copy Public Key to VPS

```bash
# On your LOCAL machine - copy the public key content
type C:\Users\Silviu\.ssh\id_ed25519.pub

# On the VPS as your non-root user (solunar)
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Paste your public key into authorized_keys
nano ~/.ssh/authorized_keys
# Paste the key and save (Ctrl+O, Enter, Ctrl+X)

chmod 600 ~/.ssh/authorized_keys
```

### 2.3 Harden SSH Configuration

```bash
# Backup original config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Create hardened SSH config
sudo tee /etc/ssh/sshd_config > /dev/null << 'EOF'
# ===========================================
# HARDENED SSH CONFIGURATION
# calendarsolunar.ro VPS
# ===========================================

# Network Settings
Port 2222
AddressFamily inet
ListenAddress 0.0.0.0

# Protocol and Key Exchange
Protocol 2
HostKey /etc/ssh/ssh_host_ed25519_key
HostKey /etc/ssh/ssh_host_rsa_key

# Strong ciphers only
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512,hmac-sha2-256
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512

# Authentication
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
AuthenticationMethods publickey

# Limit authentication attempts
MaxAuthTries 3
MaxSessions 3
LoginGraceTime 30

# Disable forwarding (unless needed)
AllowTcpForwarding no
X11Forwarding no
AllowAgentForwarding no
PermitTunnel no

# Session settings
ClientAliveInterval 300
ClientAliveCountMax 2
TCPKeepAlive yes

# Logging
SyslogFacility AUTH
LogLevel VERBOSE

# Restrict users (add your username)
AllowUsers solunar

# Banner
Banner /etc/ssh/banner

# Subsystem
Subsystem sftp /usr/lib/openssh/sftp-server -f AUTHPRIV -l INFO

# Disable unused authentication methods
KerberosAuthentication no
GSSAPIAuthentication no
HostbasedAuthentication no
EOF
```

### 2.4 Create SSH Warning Banner

```bash
sudo tee /etc/ssh/banner > /dev/null << 'EOF'
***************************************************************************
                            AUTHORIZED ACCESS ONLY
***************************************************************************
This system is for authorized users only. All activity is logged and
monitored. Unauthorized access attempts will be reported to authorities.

By accessing this system, you consent to monitoring of your activities.
***************************************************************************
EOF
```

### 2.5 Regenerate Host Keys (Fresh Install)

```bash
# Remove old host keys
sudo rm -f /etc/ssh/ssh_host_*

# Regenerate with strong algorithms
sudo ssh-keygen -t ed25519 -f /etc/ssh/ssh_host_ed25519_key -N ""
sudo ssh-keygen -t rsa -b 4096 -f /etc/ssh/ssh_host_rsa_key -N ""

# Set proper permissions
sudo chmod 600 /etc/ssh/ssh_host_*
sudo chmod 644 /etc/ssh/ssh_host_*.pub
```

### 2.6 Apply SSH Changes

```bash
# Test configuration syntax
sudo sshd -t

# If no errors, restart SSH
sudo systemctl restart sshd

# IMPORTANT: Keep current session open!
# Open a NEW terminal and test connection:
# ssh -p 2222 solunar@185.224.139.191
```

---

## 3. Firewall Configuration (UFW)

### 3.1 Configure UFW Rules

```bash
# Reset UFW to defaults
sudo ufw reset

# Set default policies (deny incoming, allow outgoing)
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH on new port (2222) with rate limiting
sudo ufw limit 2222/tcp comment 'SSH with rate limiting'

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Block the default SSH port explicitly
sudo ufw deny 22/tcp comment 'Block default SSH'

# Enable UFW
sudo ufw enable

# Verify rules
sudo ufw status verbose
```

### 3.2 Advanced UFW Rules (Optional)

```bash
# Allow specific IP only for SSH (if you have static IP)
# sudo ufw allow from YOUR_HOME_IP to any port 2222 proto tcp

# Rate limit HTTP/HTTPS (basic DDoS protection)
sudo ufw limit 80/tcp
sudo ufw limit 443/tcp

# Block common attack ports
sudo ufw deny 23/tcp comment 'Block Telnet'
sudo ufw deny 3389/tcp comment 'Block RDP'
sudo ufw deny 5900/tcp comment 'Block VNC'

# Log denied connections
sudo ufw logging on
sudo ufw logging high
```

### 3.3 UFW Status Check Script

```bash
# Create a script to check firewall status
sudo tee /usr/local/bin/check-firewall << 'EOF'
#!/bin/bash
echo "=== UFW Status ==="
sudo ufw status verbose

echo ""
echo "=== Active Connections ==="
sudo netstat -tulpn | grep LISTEN

echo ""
echo "=== Recent Blocked Connections ==="
sudo grep -i "ufw block" /var/log/ufw.log | tail -20
EOF

sudo chmod +x /usr/local/bin/check-firewall
```

---

## 4. Fail2ban for Brute-Force Protection

### 4.1 Configure Fail2ban

```bash
# Create local configuration (never edit jail.conf directly)
sudo tee /etc/fail2ban/jail.local > /dev/null << 'EOF'
# ===========================================
# FAIL2BAN CONFIGURATION
# calendarsolunar.ro VPS
# ===========================================

[DEFAULT]
# Ban settings
bantime = 24h
findtime = 10m
maxretry = 3

# Email notifications (optional - configure postfix first)
# destemail = your-email@example.com
# sender = fail2ban@calendarsolunar.ro
# mta = sendmail
# action = %(action_mwl)s

# Ignore localhost
ignoreip = 127.0.0.1/8 ::1

# Backend
backend = systemd

# ===========================================
# SSH JAIL
# ===========================================
[sshd]
enabled = true
port = 2222
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 7d
findtime = 10m

# Aggressive mode for SSH
[sshd-aggressive]
enabled = true
port = 2222
filter = sshd[mode=aggressive]
logpath = /var/log/auth.log
maxretry = 2
bantime = 30d

# ===========================================
# NGINX JAILS
# ===========================================
[nginx-http-auth]
enabled = true
port = http,https
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 24h

[nginx-limit-req]
enabled = true
port = http,https
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 5
bantime = 1h

[nginx-botsearch]
enabled = true
port = http,https
filter = nginx-botsearch
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 7d

[nginx-badbots]
enabled = true
port = http,https
filter = nginx-badbots
logpath = /var/log/nginx/access.log
maxretry = 1
bantime = 7d

# ===========================================
# ADDITIONAL PROTECTIONS
# ===========================================
[recidive]
enabled = true
logpath = /var/log/fail2ban.log
banaction = %(banaction_allports)s
bantime = 1w
findtime = 1d
maxretry = 5
EOF
```

### 4.2 Create Custom Nginx Filters

```bash
# Bad bots filter
sudo tee /etc/fail2ban/filter.d/nginx-badbots.conf > /dev/null << 'EOF'
[Definition]
failregex = ^<HOST> .* "(GET|POST|HEAD).*(\.php|\.asp|\.exe|\.pl|wp-admin|wp-login|phpmyadmin|\.env|\.git|\.sql).*HTTP.*"
            ^<HOST> .* ".*(?:masscan|nikto|sqlmap|nmap|dirbuster|gobuster).*"
ignoreregex =
EOF

# Nginx limit request filter
sudo tee /etc/fail2ban/filter.d/nginx-limit-req.conf > /dev/null << 'EOF'
[Definition]
failregex = limiting requests, excess:.* by zone.*client: <HOST>
ignoreregex =
EOF

# Bot search filter for common attack patterns
sudo tee /etc/fail2ban/filter.d/nginx-botsearch.conf > /dev/null << 'EOF'
[Definition]
failregex = ^<HOST> \- \S+ \[\] \"(GET|POST|HEAD) \/(wp-|cgi-|admin|\.well-known\/security\.txt|\.env|backup|\.git)
ignoreregex =
EOF
```

### 4.3 Enable and Start Fail2ban

```bash
# Test configuration
sudo fail2ban-client --test

# Enable and start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check status
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

### 4.4 Fail2ban Management Commands

```bash
# Create management script
sudo tee /usr/local/bin/f2b-manage << 'EOF'
#!/bin/bash

case "$1" in
    status)
        sudo fail2ban-client status
        ;;
    banned)
        echo "=== All Banned IPs ==="
        for jail in $(sudo fail2ban-client status | grep "Jail list" | sed 's/.*://;s/,//g'); do
            echo "--- $jail ---"
            sudo fail2ban-client status $jail | grep "Banned IP"
        done
        ;;
    unban)
        if [ -z "$2" ]; then
            echo "Usage: f2b-manage unban <IP>"
            exit 1
        fi
        for jail in $(sudo fail2ban-client status | grep "Jail list" | sed 's/.*://;s/,//g'); do
            sudo fail2ban-client set $jail unbanip $2 2>/dev/null
        done
        echo "Unbanned $2 from all jails"
        ;;
    reload)
        sudo fail2ban-client reload
        ;;
    *)
        echo "Usage: f2b-manage {status|banned|unban <IP>|reload}"
        ;;
esac
EOF

sudo chmod +x /usr/local/bin/f2b-manage
```

---

## 5. System Hardening

### 5.1 Automatic Security Updates

```bash
# Configure unattended upgrades
sudo tee /etc/apt/apt.conf.d/50unattended-upgrades > /dev/null << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};

Unattended-Upgrade::Package-Blacklist {
};

Unattended-Upgrade::DevRelease "false";
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Automatic-Reboot-Time "04:00";
EOF

# Enable automatic updates
sudo tee /etc/apt/apt.conf.d/20auto-upgrades > /dev/null << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Download-Upgradeable-Packages "1";
EOF

# Enable the service
sudo systemctl enable unattended-upgrades
sudo systemctl start unattended-upgrades
```

### 5.2 Disable Unnecessary Services

```bash
# List running services
systemctl list-units --type=service --state=running

# Disable common unnecessary services (adjust based on your needs)
sudo systemctl disable --now cups 2>/dev/null
sudo systemctl disable --now avahi-daemon 2>/dev/null
sudo systemctl disable --now bluetooth 2>/dev/null
sudo systemctl disable --now cups-browsed 2>/dev/null

# Disable unused network protocols
sudo tee /etc/modprobe.d/disable-unused-protocols.conf > /dev/null << 'EOF'
# Disable unused network protocols
install dccp /bin/true
install sctp /bin/true
install rds /bin/true
install tipc /bin/true
EOF
```

### 5.3 Kernel Hardening (sysctl)

```bash
sudo tee /etc/sysctl.d/99-security-hardening.conf > /dev/null << 'EOF'
# ===========================================
# KERNEL HARDENING
# calendarsolunar.ro VPS
# ===========================================

# IP Spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP broadcast requests
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Disable source packet routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0

# Ignore send redirects
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0

# Block SYN attacks
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5

# Log Martians (spoofed packets)
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# Ignore ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0

# Ignore Directed pings
net.ipv4.icmp_echo_ignore_all = 0

# Disable IPv6 if not needed (uncomment if not using IPv6)
# net.ipv6.conf.all.disable_ipv6 = 1
# net.ipv6.conf.default.disable_ipv6 = 1

# Protect against time-wait assassination
net.ipv4.tcp_rfc1337 = 1

# Increase system file descriptor limit
fs.file-max = 65535

# Increase system IP port limits
net.ipv4.ip_local_port_range = 2000 65000

# Increase TCP max buffer size
net.ipv4.tcp_rmem = 4096 87380 8388608
net.ipv4.tcp_wmem = 4096 87380 8388608

# Increase the number of outstanding syn requests
net.core.somaxconn = 65535

# Protect against PTRACE
kernel.yama.ptrace_scope = 2

# Restrict dmesg access
kernel.dmesg_restrict = 1

# Restrict kernel pointers
kernel.kptr_restrict = 2

# Enable ASLR
kernel.randomize_va_space = 2
EOF

# Apply settings
sudo sysctl -p /etc/sysctl.d/99-security-hardening.conf
```

### 5.4 Secure Shared Memory

```bash
# Add to fstab
echo "tmpfs /run/shm tmpfs defaults,noexec,nosuid 0 0" | sudo tee -a /etc/fstab

# Remount (or reboot)
sudo mount -o remount /run/shm 2>/dev/null || true
```

### 5.5 Set Secure File Permissions

```bash
# Secure sensitive files
sudo chmod 700 /root
sudo chmod 600 /etc/ssh/sshd_config
sudo chmod 600 /etc/shadow
sudo chmod 644 /etc/passwd

# Secure cron
sudo chmod 700 /etc/cron.d
sudo chmod 700 /etc/cron.daily
sudo chmod 700 /etc/cron.hourly
sudo chmod 700 /etc/cron.monthly
sudo chmod 700 /etc/cron.weekly

# Remove world-writable permissions from system files
sudo find /etc -perm -002 -type f -exec chmod o-w {} \; 2>/dev/null
```

---

## 6. Node.js/npm Security

### 6.1 Install Node.js Securely (using NodeSource)

```bash
# Remove any existing Node.js
sudo apt remove --purge nodejs npm -y 2>/dev/null
sudo rm -rf /usr/local/lib/node_modules
sudo rm -rf ~/.npm

# Install Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 6.2 npm Security Configuration

```bash
# Create secure npm config
mkdir -p ~/.npm
tee ~/.npmrc > /dev/null << 'EOF'
# Audit on install
audit=true

# Strict SSL
strict-ssl=true

# Don't save exact versions (use ranges for security updates)
save-exact=false

# Ignore scripts for untrusted packages (enable per-project if needed)
ignore-scripts=false

# Prefer offline packages when available
prefer-offline=true

# Registry (official only)
registry=https://registry.npmjs.org/

# Reduce metadata exposure
fund=false
update-notifier=false
EOF
```

### 6.3 Create Dedicated App User

```bash
# Create application user (no login shell)
sudo useradd -r -s /bin/false -d /var/www/solunar solunar-app

# Create app directory
sudo mkdir -p /var/www/solunar
sudo chown solunar-app:solunar-app /var/www/solunar
sudo chmod 750 /var/www/solunar
```

### 6.4 npm Audit Script

```bash
sudo tee /usr/local/bin/npm-security-check << 'EOF'
#!/bin/bash
# npm Security Check Script

APP_DIR="/var/www/solunar"

echo "=== npm Security Audit ==="
echo "Date: $(date)"
echo ""

cd $APP_DIR

echo "--- Running npm audit ---"
npm audit 2>/dev/null || echo "Run 'npm audit' manually in the app directory"

echo ""
echo "--- Checking for outdated packages ---"
npm outdated 2>/dev/null || true

echo ""
echo "--- Package vulnerabilities summary ---"
npm audit --json 2>/dev/null | jq '.metadata.vulnerabilities' 2>/dev/null || true

echo ""
echo "=== Security check complete ==="
EOF

sudo chmod +x /usr/local/bin/npm-security-check
```

### 6.5 PM2 Security Configuration

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create PM2 ecosystem file for secure deployment
sudo tee /var/www/solunar/ecosystem.config.js > /dev/null << 'EOF'
module.exports = {
    apps: [
        {
            name: 'solunar-app',
            script: '.next/standalone/server.js',
            cwd: '/var/www/solunar',
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',

            // Security: Run as non-root user
            // user: 'solunar-app',  // Uncomment if PM2 runs as root

            // Environment
            env: {
                NODE_ENV: 'production',
                PORT: 3500,
                HOSTNAME: '127.0.0.1',  // Only listen on localhost (nginx proxies)
            },

            // Logging
            error_file: '/var/log/pm2/solunar-error.log',
            out_file: '/var/log/pm2/solunar-out.log',
            log_file: '/var/log/pm2/solunar-combined.log',
            time: true,

            // Resource limits
            node_args: [
                '--max-old-space-size=512',
                '--no-deprecation'
            ],

            // Kill timeout
            kill_timeout: 5000,

            // Restart delay
            restart_delay: 1000,

            // Max restarts before stopping
            max_restarts: 10,
            min_uptime: '10s',
        },
    ],
};
EOF

# Create PM2 log directory
sudo mkdir -p /var/log/pm2
sudo chown -R solunar:solunar /var/log/pm2

# Configure PM2 startup (as your deploy user, not root)
pm2 startup systemd -u solunar --hp /home/solunar
```

---

## 7. Nginx Security Configuration

### 7.1 Complete Hardened Nginx Configuration

```bash
# Backup existing config
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Create hardened main nginx.conf
sudo tee /etc/nginx/nginx.conf > /dev/null << 'EOF'
# ===========================================
# HARDENED NGINX CONFIGURATION
# calendarsolunar.ro VPS
# ===========================================

user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

# Security: Hide nginx version
error_log /var/log/nginx/error.log warn;

events {
    worker_connections 1024;
    multi_accept on;
    use epoll;
}

http {
    # ===========================================
    # BASIC SETTINGS
    # ===========================================
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Security: Hide nginx version
    server_tokens off;

    # Security: Limit request sizes
    client_max_body_size 10M;
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 8k;

    # Security: Timeouts
    client_body_timeout 12;
    client_header_timeout 12;
    send_timeout 10;

    # MIME types
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # ===========================================
    # SSL SETTINGS
    # ===========================================
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;

    # ===========================================
    # LOGGING
    # ===========================================
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    log_format security '$remote_addr - $remote_user [$time_local] '
                        '"$request" $status $body_bytes_sent '
                        '"$http_referer" "$http_user_agent" '
                        '$request_time $upstream_response_time';

    access_log /var/log/nginx/access.log main;

    # ===========================================
    # GZIP COMPRESSION
    # ===========================================
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # ===========================================
    # RATE LIMITING
    # ===========================================
    # Limit request rate (10 requests/second with burst of 20)
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=5r/s;

    # Limit connections per IP
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

    # ===========================================
    # SECURITY MAPS
    # ===========================================
    # Block bad user agents
    map $http_user_agent $bad_bot {
        default 0;
        ~*masscan 1;
        ~*nikto 1;
        ~*sqlmap 1;
        ~*nmap 1;
        ~*dirbuster 1;
        ~*gobuster 1;
        ~*wget 1;
        ~*curl 1;
        ~*libwww 1;
        ~*lwp-trivial 1;
        ~*python 1;
        ~*perl 1;
        ~*ruby 1;
        ~*java 1;
        ~*scrapy 1;
        ~*phantomjs 1;
        ~*headless 1;
    }

    # Include site configs
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
EOF
```

### 7.2 Site-Specific Configuration

```bash
sudo tee /etc/nginx/sites-available/calendarsolunar.ro > /dev/null << 'EOF'
# ===========================================
# calendarsolunar.ro SITE CONFIGURATION
# ===========================================

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name calendarsolunar.ro www.calendarsolunar.ro;

    # ACME challenge for Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        allow all;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://calendarsolunar.ro$request_uri;
    }
}

# Redirect www to non-www
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.calendarsolunar.ro;

    ssl_certificate /etc/letsencrypt/live/calendarsolunar.ro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/calendarsolunar.ro/privkey.pem;

    return 301 https://calendarsolunar.ro$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name calendarsolunar.ro;

    # ===========================================
    # SSL CERTIFICATES
    # ===========================================
    ssl_certificate /etc/letsencrypt/live/calendarsolunar.ro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/calendarsolunar.ro/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/calendarsolunar.ro/chain.pem;

    # DH parameters (generate with: openssl dhparam -out /etc/nginx/dhparam.pem 2048)
    ssl_dhparam /etc/nginx/dhparam.pem;

    # ===========================================
    # SECURITY HEADERS
    # ===========================================
    # HSTS (2 years, include subdomains, preload)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Prevent clickjacking
    add_header X-Frame-Options "DENY" always;

    # Prevent MIME type sniffing
    add_header X-Content-Type-Options "nosniff" always;

    # XSS Protection
    add_header X-XSS-Protection "1; mode=block" always;

    # Referrer Policy
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Permissions Policy (Feature Policy)
    add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" always;

    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://pagead2.googlesyndication.com; frame-src https://googleads.g.doubleclick.net https://www.google.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;

    # ===========================================
    # LOGGING
    # ===========================================
    access_log /var/log/nginx/calendarsolunar.access.log security;
    error_log /var/log/nginx/calendarsolunar.error.log warn;

    # ===========================================
    # RATE LIMITING
    # ===========================================
    limit_req zone=general burst=20 nodelay;
    limit_conn conn_limit 20;

    # ===========================================
    # SECURITY BLOCKS
    # ===========================================
    # Block bad bots
    if ($bad_bot) {
        return 403;
    }

    # Block access to hidden files
    location ~ /\. {
        deny all;
        return 404;
    }

    # Block access to sensitive files
    location ~* \.(env|git|htaccess|htpasswd|ini|log|sh|sql|conf|config)$ {
        deny all;
        return 404;
    }

    # Block common attack patterns
    location ~* (wp-admin|wp-login|wp-content|phpmyadmin|myadmin|mysql|administrator) {
        deny all;
        return 404;
    }

    # ===========================================
    # PROXY TO NEXT.JS
    # ===========================================
    location / {
        proxy_pass http://127.0.0.1:3500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # ===========================================
    # STATIC FILES
    # ===========================================
    location /_next/static {
        proxy_pass http://127.0.0.1:3500;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /static {
        proxy_pass http://127.0.0.1:3500;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Favicon
    location = /favicon.ico {
        proxy_pass http://127.0.0.1:3500;
        log_not_found off;
        access_log off;
    }

    # Robots.txt
    location = /robots.txt {
        proxy_pass http://127.0.0.1:3500;
        log_not_found off;
        access_log off;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/calendarsolunar.ro /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Generate DH parameters (this takes a few minutes)
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048

# Create certbot webroot directory
sudo mkdir -p /var/www/certbot

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 7.3 SSL Certificate Setup with Certbot

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d calendarsolunar.ro -d www.calendarsolunar.ro

# Test auto-renewal
sudo certbot renew --dry-run

# Set up auto-renewal cron
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
```

---

## 8. File Integrity Monitoring

### 8.1 Configure AIDE (Advanced Intrusion Detection Environment)

```bash
# Initialize AIDE database
sudo aideinit

# Copy database to active location
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Create custom AIDE rules
sudo tee /etc/aide/aide.conf.d/99_custom_rules > /dev/null << 'EOF'
# Custom AIDE rules for calendarsolunar.ro

# Monitor application directory
/var/www/solunar CONTENT_EX

# Monitor nginx configs
/etc/nginx CONTENT_EX

# Monitor SSH configs
/etc/ssh CONTENT_EX

# Monitor system binaries
/usr/bin CONTENT_EX
/usr/sbin CONTENT_EX
/bin CONTENT_EX
/sbin CONTENT_EX

# Monitor cron
/etc/cron.d CONTENT_EX
/etc/cron.daily CONTENT_EX
/etc/cron.hourly CONTENT_EX
/var/spool/cron CONTENT_EX

# Exclude frequently changing files
!/var/log
!/var/cache
!/var/tmp
!/tmp
!/var/www/solunar/.next
!/var/www/solunar/node_modules
EOF

# Reinitialize with custom rules
sudo aideinit
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db
```

### 8.2 AIDE Check Script

```bash
sudo tee /usr/local/bin/aide-check << 'EOF'
#!/bin/bash
# AIDE File Integrity Check

LOG_FILE="/var/log/aide/aide-check.log"
ALERT_FILE="/var/log/aide/aide-alert.log"

mkdir -p /var/log/aide

echo "=== AIDE Check: $(date) ===" >> $LOG_FILE

# Run AIDE check
RESULT=$(sudo aide --check 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "ALERT: File integrity changes detected!" | tee -a $ALERT_FILE
    echo "$RESULT" >> $ALERT_FILE

    # Send alert (configure email or webhook)
    # mail -s "AIDE Alert - calendarsolunar.ro" admin@example.com < $ALERT_FILE

    echo "Changes detected - see $ALERT_FILE for details"
else
    echo "No changes detected" >> $LOG_FILE
fi

echo "$RESULT" >> $LOG_FILE
echo "" >> $LOG_FILE
EOF

sudo chmod +x /usr/local/bin/aide-check

# Add to cron (daily check at 3 AM)
(sudo crontab -l 2>/dev/null; echo "0 3 * * * /usr/local/bin/aide-check") | sudo crontab -
```

### 8.3 Monitor Critical Files with inotify

```bash
# Install inotify-tools
sudo apt install -y inotify-tools

# Create file monitoring script
sudo tee /usr/local/bin/file-monitor << 'EOF'
#!/bin/bash
# Real-time file monitoring for critical directories

LOG_FILE="/var/log/file-monitor.log"
WATCH_DIRS="/etc/ssh /etc/nginx /etc/cron.d /var/www/solunar"

echo "Starting file monitor at $(date)" >> $LOG_FILE

inotifywait -m -r -e modify,create,delete,move --format '%T %w%f %e' --timefmt '%Y-%m-%d %H:%M:%S' $WATCH_DIRS 2>/dev/null | while read line; do
    echo "CHANGE: $line" >> $LOG_FILE

    # Alert on suspicious changes
    if echo "$line" | grep -qE "(ssh|cron|authorized_keys)"; then
        echo "CRITICAL CHANGE: $line" >> /var/log/file-monitor-alerts.log
    fi
done
EOF

sudo chmod +x /usr/local/bin/file-monitor

# Create systemd service for file monitoring
sudo tee /etc/systemd/system/file-monitor.service > /dev/null << 'EOF'
[Unit]
Description=File Integrity Monitor
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/file-monitor
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable file-monitor
sudo systemctl start file-monitor
```

---

## 9. Log Monitoring and Alerting

### 9.1 Configure Logwatch

```bash
# Configure logwatch
sudo tee /etc/logwatch/conf/logwatch.conf > /dev/null << 'EOF'
Output = stdout
Format = html
MailTo = root
MailFrom = Logwatch
Range = yesterday
Detail = High
Service = All
Service = -zz-network
Service = -zz-sys
Service = -eximstats
EOF

# Create daily logwatch cron
(sudo crontab -l 2>/dev/null; echo "0 6 * * * /usr/sbin/logwatch --output mail --mailto admin@example.com --detail high") | sudo crontab -
```

### 9.2 Custom Security Log Monitor

```bash
sudo tee /usr/local/bin/security-log-monitor << 'EOF'
#!/bin/bash
# Security Log Monitor for calendarsolunar.ro

LOG_DIR="/var/log"
REPORT_FILE="/var/log/security-daily-report.log"

echo "=========================================" > $REPORT_FILE
echo "Security Report: $(date)" >> $REPORT_FILE
echo "Host: $(hostname)" >> $REPORT_FILE
echo "=========================================" >> $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=== Failed SSH Logins (Last 24h) ===" >> $REPORT_FILE
grep "Failed password" /var/log/auth.log | grep "$(date --date='yesterday' '+%b %d')\|$(date '+%b %d')" | wc -l >> $REPORT_FILE
echo "Top attacking IPs:" >> $REPORT_FILE
grep "Failed password" /var/log/auth.log | grep -oE "[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+" | sort | uniq -c | sort -rn | head -10 >> $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=== Successful SSH Logins (Last 24h) ===" >> $REPORT_FILE
grep "Accepted" /var/log/auth.log | grep "$(date --date='yesterday' '+%b %d')\|$(date '+%b %d')" >> $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=== Fail2ban Bans (Last 24h) ===" >> $REPORT_FILE
grep "Ban" /var/log/fail2ban.log | grep "$(date --date='yesterday' '+%Y-%m-%d')\|$(date '+%Y-%m-%d')" | wc -l >> $REPORT_FILE
echo "Banned IPs:" >> $REPORT_FILE
grep "Ban" /var/log/fail2ban.log | grep "$(date --date='yesterday' '+%Y-%m-%d')\|$(date '+%Y-%m-%d')" | tail -20 >> $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=== Nginx 4xx/5xx Errors (Last 24h) ===" >> $REPORT_FILE
grep "$(date --date='yesterday' '+%d/%b/%Y')\|$(date '+%d/%b/%Y')" /var/log/nginx/access.log 2>/dev/null | grep -E '" (4|5)[0-9]{2} ' | wc -l >> $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=== Suspicious Nginx Requests ===" >> $REPORT_FILE
grep -iE "(\.php|\.asp|wp-admin|phpmyadmin|\.env|\.git)" /var/log/nginx/access.log 2>/dev/null | tail -20 >> $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=== System Resource Usage ===" >> $REPORT_FILE
echo "Disk Usage:" >> $REPORT_FILE
df -h >> $REPORT_FILE
echo "" >> $REPORT_FILE
echo "Memory Usage:" >> $REPORT_FILE
free -h >> $REPORT_FILE
echo "" >> $REPORT_FILE
echo "Load Average:" >> $REPORT_FILE
uptime >> $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=== Active Network Connections ===" >> $REPORT_FILE
netstat -tulpn | grep LISTEN >> $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=== Currently Logged In Users ===" >> $REPORT_FILE
who >> $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=== Recent sudo Commands ===" >> $REPORT_FILE
grep "sudo" /var/log/auth.log | tail -20 >> $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=== PM2 Application Status ===" >> $REPORT_FILE
pm2 list 2>/dev/null >> $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=========================================" >> $REPORT_FILE
echo "End of Report" >> $REPORT_FILE
echo "=========================================" >> $REPORT_FILE

# Display report
cat $REPORT_FILE

# Optionally send via email
# mail -s "Security Report - calendarsolunar.ro - $(date '+%Y-%m-%d')" admin@example.com < $REPORT_FILE
EOF

sudo chmod +x /usr/local/bin/security-log-monitor

# Add to cron (run daily at 7 AM)
(sudo crontab -l 2>/dev/null; echo "0 7 * * * /usr/local/bin/security-log-monitor") | sudo crontab -
```

### 9.3 Configure auditd for Advanced Logging

```bash
# Enable auditd
sudo systemctl enable auditd
sudo systemctl start auditd

# Add security audit rules
sudo tee /etc/audit/rules.d/security.rules > /dev/null << 'EOF'
# Delete all existing rules
-D

# Buffer Size
-b 8192

# Failure Mode
-f 1

# Monitor user/group changes
-w /etc/passwd -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/gshadow -p wa -k identity
-w /etc/sudoers -p wa -k identity
-w /etc/sudoers.d/ -p wa -k identity

# Monitor SSH config
-w /etc/ssh/sshd_config -p wa -k sshd

# Monitor cron
-w /etc/crontab -p wa -k cron
-w /etc/cron.d/ -p wa -k cron
-w /var/spool/cron/ -p wa -k cron

# Monitor network configuration
-w /etc/hosts -p wa -k network
-w /etc/network/ -p wa -k network

# Monitor nginx
-w /etc/nginx/ -p wa -k nginx

# Monitor time changes
-a always,exit -F arch=b64 -S adjtimex -S settimeofday -k time-change

# Monitor user commands
-a always,exit -F arch=b64 -S execve -F euid=0 -k root-commands

# Monitor unsuccessful file access
-a always,exit -F arch=b64 -S open -F exit=-EACCES -k access
-a always,exit -F arch=b64 -S open -F exit=-EPERM -k access

# Monitor mount operations
-a always,exit -F arch=b64 -S mount -F auid>=1000 -F auid!=4294967295 -k mounts

# Make the configuration immutable (requires reboot to change)
-e 2
EOF

# Restart auditd
sudo systemctl restart auditd
```

---

## 10. Rootkit Detection

### 10.1 Configure rkhunter

```bash
# Update rkhunter database
sudo rkhunter --update

# Configure rkhunter
sudo tee /etc/rkhunter.conf.local > /dev/null << 'EOF'
# rkhunter local configuration

# Update mirrors
UPDATE_MIRRORS=1
MIRRORS_MODE=0
WEB_CMD=""

# Email alerts
MAIL-ON-WARNING=root
MAIL_CMD=mail -s "[rkhunter] Warnings found on ${HOST_NAME}"

# Allow script whitelisting
SCRIPTWHITELIST=/usr/bin/egrep
SCRIPTWHITELIST=/usr/bin/fgrep
SCRIPTWHITELIST=/usr/bin/which
SCRIPTWHITELIST=/usr/bin/ldd
SCRIPTWHITELIST=/usr/bin/lwp-request

# Allow specific files
ALLOWHIDDENDIR=/etc/.git
ALLOWHIDDENDIR=/dev/.udev
ALLOWHIDDENFILE=/dev/.blkid.tab
ALLOWHIDDENFILE=/dev/.blkid.tab.old

# Database update
PKGMGR=DPKG

# Hash function
HASH_CMD=SHA256

# Disable specific tests if needed
# DISABLE_TESTS=suspscan hidden_procs deleted_files packet_cap_apps
EOF

# Run initial scan and create baseline
sudo rkhunter --propupd

# Run check
sudo rkhunter --check --skip-keypress
```

### 10.2 Configure chkrootkit

```bash
# Run chkrootkit
sudo chkrootkit

# Create automated check script
sudo tee /usr/local/bin/rootkit-check << 'EOF'
#!/bin/bash
# Rootkit Detection Script

LOG_FILE="/var/log/rootkit-check.log"
ALERT_FILE="/var/log/rootkit-alert.log"

echo "=========================================" >> $LOG_FILE
echo "Rootkit Check: $(date)" >> $LOG_FILE
echo "=========================================" >> $LOG_FILE

# Run rkhunter
echo "=== rkhunter Results ===" >> $LOG_FILE
sudo rkhunter --check --skip-keypress --report-warnings-only >> $LOG_FILE 2>&1
RK_EXIT=$?

# Run chkrootkit
echo "" >> $LOG_FILE
echo "=== chkrootkit Results ===" >> $LOG_FILE
sudo chkrootkit 2>&1 | grep -v "not found\|nothing found\|not infected\|not tested" >> $LOG_FILE
CK_EXIT=$?

# Check for warnings
if [ $RK_EXIT -ne 0 ] || grep -qE "INFECTED|Warning|Rootkit" $LOG_FILE; then
    echo "ALERT: Potential rootkit detected!" > $ALERT_FILE
    cat $LOG_FILE >> $ALERT_FILE

    # Send alert
    # mail -s "ROOTKIT ALERT - calendarsolunar.ro" admin@example.com < $ALERT_FILE

    echo "WARNING: Potential threats detected. Check $LOG_FILE"
else
    echo "No threats detected" >> $LOG_FILE
fi

echo "" >> $LOG_FILE
EOF

sudo chmod +x /usr/local/bin/rootkit-check

# Add to cron (weekly on Sunday at 2 AM)
(sudo crontab -l 2>/dev/null; echo "0 2 * * 0 /usr/local/bin/rootkit-check") | sudo crontab -
```

---

## 11. Automated Security Audit Scripts

### 11.1 Comprehensive Security Audit Script

```bash
sudo tee /usr/local/bin/security-audit << 'EOF'
#!/bin/bash
# ===========================================
# COMPREHENSIVE SECURITY AUDIT SCRIPT
# calendarsolunar.ro VPS
# ===========================================

REPORT_DIR="/var/log/security-audit"
REPORT_FILE="$REPORT_DIR/audit-$(date +%Y%m%d-%H%M%S).log"

mkdir -p $REPORT_DIR

{
echo "========================================="
echo "SECURITY AUDIT REPORT"
echo "Host: $(hostname)"
echo "Date: $(date)"
echo "========================================="

echo ""
echo "=== 1. SYSTEM INFORMATION ==="
echo "Kernel: $(uname -r)"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "Uptime: $(uptime -p)"

echo ""
echo "=== 2. USER ACCOUNTS AUDIT ==="
echo "--- Users with UID 0 (root privileges) ---"
awk -F: '($3 == "0") {print $1}' /etc/passwd

echo ""
echo "--- Users with empty passwords ---"
sudo awk -F: '($2 == "") {print $1}' /etc/shadow

echo ""
echo "--- Users with login shells ---"
grep -v "nologin\|false" /etc/passwd | cut -d: -f1

echo ""
echo "--- Recent login attempts ---"
last -n 10

echo ""
echo "=== 3. SSH SECURITY ==="
echo "--- SSH Configuration Check ---"
grep -E "^(PermitRootLogin|PasswordAuthentication|PubkeyAuthentication|Port|AllowUsers)" /etc/ssh/sshd_config

echo ""
echo "--- Authorized Keys ---"
for user_home in /home/*; do
    if [ -f "$user_home/.ssh/authorized_keys" ]; then
        echo "User: $(basename $user_home)"
        cat "$user_home/.ssh/authorized_keys"
    fi
done

echo ""
echo "=== 4. FIREWALL STATUS ==="
sudo ufw status verbose

echo ""
echo "=== 5. LISTENING SERVICES ==="
sudo netstat -tulpn | grep LISTEN

echo ""
echo "=== 6. RUNNING PROCESSES (suspicious check) ==="
echo "--- Processes running as root ---"
ps aux | awk '$1=="root" {print $11}' | sort | uniq -c | sort -rn | head -20

echo ""
echo "--- Processes with high CPU ---"
ps aux --sort=-%cpu | head -10

echo ""
echo "--- Processes with high memory ---"
ps aux --sort=-%mem | head -10

echo ""
echo "=== 7. CRON JOBS AUDIT ==="
echo "--- System crontab ---"
cat /etc/crontab

echo ""
echo "--- Cron.d contents ---"
ls -la /etc/cron.d/

echo ""
echo "--- User crontabs ---"
for user in $(cut -f1 -d: /etc/passwd); do
    crontab -l -u $user 2>/dev/null | grep -v "^#"
done

echo ""
echo "=== 8. SUDO CONFIGURATION ==="
sudo cat /etc/sudoers | grep -v "^#" | grep -v "^$"

echo ""
echo "=== 9. WORLD-WRITABLE FILES ==="
find / -xdev -type f -perm -0002 -ls 2>/dev/null | head -20

echo ""
echo "=== 10. SUID/SGID FILES ==="
find / -xdev \( -perm -4000 -o -perm -2000 \) -type f -ls 2>/dev/null

echo ""
echo "=== 11. FILES MODIFIED IN LAST 24 HOURS ==="
find /etc /usr/bin /usr/sbin /bin /sbin -mtime -1 -ls 2>/dev/null

echo ""
echo "=== 12. FAIL2BAN STATUS ==="
sudo fail2ban-client status 2>/dev/null
for jail in $(sudo fail2ban-client status 2>/dev/null | grep "Jail list" | sed 's/.*://;s/,//g'); do
    echo "--- $jail ---"
    sudo fail2ban-client status $jail 2>/dev/null
done

echo ""
echo "=== 13. PACKAGE SECURITY ==="
echo "--- Packages with available security updates ---"
apt list --upgradable 2>/dev/null | grep -i security

echo ""
echo "=== 14. NGINX SECURITY ==="
echo "--- Nginx configuration test ---"
sudo nginx -t 2>&1

echo ""
echo "--- SSL Certificate expiry ---"
echo | openssl s_client -servername calendarsolunar.ro -connect calendarsolunar.ro:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null

echo ""
echo "=== 15. APPLICATION STATUS ==="
echo "--- PM2 processes ---"
pm2 list 2>/dev/null

echo ""
echo "--- Node.js version ---"
node --version 2>/dev/null

echo ""
echo "=== 16. DISK AND MEMORY ==="
echo "--- Disk usage ---"
df -h

echo ""
echo "--- Memory usage ---"
free -h

echo ""
echo "=== 17. NETWORK CONNECTIONS ==="
echo "--- Established connections ---"
netstat -an | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -10

echo ""
echo "=== 18. LOG FILE SIZES ==="
du -sh /var/log/* 2>/dev/null | sort -rh | head -10

echo ""
echo "========================================="
echo "AUDIT COMPLETE"
echo "Report saved to: $REPORT_FILE"
echo "========================================="
} | tee $REPORT_FILE

# Cleanup old reports (keep last 30)
find $REPORT_DIR -name "audit-*.log" -mtime +30 -delete
EOF

sudo chmod +x /usr/local/bin/security-audit

# Add to cron (weekly on Monday at 1 AM)
(sudo crontab -l 2>/dev/null; echo "0 1 * * 1 /usr/local/bin/security-audit") | sudo crontab -
```

### 11.2 Quick Security Check Script

```bash
sudo tee /usr/local/bin/quick-security-check << 'EOF'
#!/bin/bash
# Quick Security Health Check

echo "=== Quick Security Check: $(date) ==="
echo ""

# Check for failed SSH attempts in last hour
FAILED_SSH=$(grep "Failed password" /var/log/auth.log | grep "$(date '+%b %d %H')" | wc -l)
echo "[SSH] Failed login attempts (last hour): $FAILED_SSH"

# Check fail2ban status
F2B_BANS=$(sudo fail2ban-client status 2>/dev/null | grep "Currently banned" | awk '{sum+=$NF} END {print sum}')
echo "[F2B] Currently banned IPs: ${F2B_BANS:-0}"

# Check if services are running
echo ""
echo "[SERVICES]"
systemctl is-active --quiet nginx && echo "  Nginx: RUNNING" || echo "  Nginx: STOPPED"
systemctl is-active --quiet fail2ban && echo "  Fail2ban: RUNNING" || echo "  Fail2ban: STOPPED"
systemctl is-active --quiet ufw && echo "  UFW: RUNNING" || echo "  UFW: STOPPED"
pm2 list 2>/dev/null | grep -q "online" && echo "  PM2 App: RUNNING" || echo "  PM2 App: CHECK REQUIRED"

# Check disk space
echo ""
echo "[DISK]"
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}')
echo "  Root partition usage: $DISK_USAGE"

# Check memory
MEM_USAGE=$(free | awk 'NR==2 {printf "%.0f%%", $3*100/$2}')
echo "  Memory usage: $MEM_USAGE"

# Check load average
LOAD=$(uptime | awk -F'load average:' '{print $2}')
echo "  Load average:$LOAD"

# Check for suspicious processes
echo ""
echo "[PROCESSES]"
CRYPTO_PROCS=$(ps aux | grep -iE "(miner|xmr|crypto|stratum)" | grep -v grep | wc -l)
if [ $CRYPTO_PROCS -gt 0 ]; then
    echo "  WARNING: Potential crypto miner processes detected!"
    ps aux | grep -iE "(miner|xmr|crypto|stratum)" | grep -v grep
else
    echo "  No suspicious mining processes detected"
fi

# Check for unusual network connections
echo ""
echo "[NETWORK]"
UNUSUAL_PORTS=$(netstat -tulpn 2>/dev/null | grep -v ":22\|:80\|:443\|:2222\|:3500" | grep LISTEN | wc -l)
echo "  Unexpected listening ports: $UNUSUAL_PORTS"

echo ""
echo "=== Check Complete ==="
EOF

sudo chmod +x /usr/local/bin/quick-security-check
```

---

## 12. Deployment Security

### 12.1 Secure Deployment Script

```bash
sudo tee /usr/local/bin/deploy-solunar << 'EOF'
#!/bin/bash
# Secure Deployment Script for calendarsolunar.ro

set -e  # Exit on error

APP_DIR="/var/www/solunar"
BACKUP_DIR="/var/backups/solunar"
DEPLOY_USER="solunar"
GIT_REPO="your-git-repo-url"  # Update this

echo "=== Starting Secure Deployment ==="
echo "Date: $(date)"

# Create backup
echo "[1/7] Creating backup..."
mkdir -p $BACKUP_DIR
BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf $BACKUP_FILE -C $APP_DIR . 2>/dev/null || true
echo "  Backup created: $BACKUP_FILE"

# Clean old backups (keep last 5)
ls -t $BACKUP_DIR/backup-*.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true

# Pull latest code
echo "[2/7] Pulling latest code..."
cd $APP_DIR
git fetch origin
git reset --hard origin/main

# Install dependencies securely
echo "[3/7] Installing dependencies..."
npm ci --production=false

# Run security audit
echo "[4/7] Running security audit..."
npm audit --audit-level=high || echo "  Warning: Some vulnerabilities found. Review npm audit output."

# Build application
echo "[5/7] Building application..."
npm run build

# Copy static files for standalone
echo "[6/7] Setting up standalone..."
cp -r public .next/standalone/public 2>/dev/null || true
cp -r .next/static .next/standalone/.next/static 2>/dev/null || true

# Restart application
echo "[7/7] Restarting application..."
pm2 restart solunar-app || pm2 start ecosystem.config.js

# Set correct permissions
chown -R $DEPLOY_USER:$DEPLOY_USER $APP_DIR

# Verify deployment
sleep 5
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3500 | grep -q "200"; then
    echo ""
    echo "=== Deployment Successful ==="
    pm2 list
else
    echo ""
    echo "=== WARNING: Application may not be responding ==="
    echo "Checking logs..."
    pm2 logs solunar-app --lines 20 --nostream
fi
EOF

sudo chmod +x /usr/local/bin/deploy-solunar
```

### 12.2 Environment Variables Security

```bash
# Create secure .env file
sudo tee /var/www/solunar/.env.local > /dev/null << 'EOF'
# Production Environment Variables
NODE_ENV=production
PORT=3500
HOSTNAME=127.0.0.1

# Add any API keys or secrets here
# Never commit this file to git!
EOF

# Secure the .env file
sudo chmod 600 /var/www/solunar/.env.local
sudo chown solunar:solunar /var/www/solunar/.env.local
```

---

## Quick Reference Commands

### Daily Security Commands

```bash
# Quick security check
quick-security-check

# Check firewall status
check-firewall

# Check fail2ban status
f2b-manage status

# View banned IPs
f2b-manage banned

# Security log report
security-log-monitor

# npm security audit
npm-security-check
```

### Weekly Security Commands

```bash
# Full security audit
security-audit

# Rootkit check
rootkit-check

# Update rkhunter
sudo rkhunter --update && sudo rkhunter --propupd

# File integrity check
aide-check
```

### Emergency Commands

```bash
# Unban an IP
f2b-manage unban <IP_ADDRESS>

# Block an IP immediately
sudo ufw insert 1 deny from <IP_ADDRESS>

# Kill suspicious process
sudo kill -9 <PID>

# Check for crypto miners
ps aux | grep -iE "(miner|xmr|crypto|stratum)" | grep -v grep

# Check outbound connections
netstat -an | grep ESTABLISHED

# View auth log in real-time
sudo tail -f /var/log/auth.log

# View nginx errors in real-time
sudo tail -f /var/log/nginx/error.log
```

---

## Post-Setup Checklist

After completing all steps, verify:

- [ ] SSH key authentication works on port 2222
- [ ] Password authentication is disabled
- [ ] UFW is enabled with correct rules
- [ ] Fail2ban is running and monitoring
- [ ] Nginx serves HTTPS correctly
- [ ] SSL certificate is valid
- [ ] PM2 application is running
- [ ] AIDE baseline is created
- [ ] Rootkit scanners run without warnings
- [ ] Automatic updates are enabled
- [ ] All cron jobs are scheduled
- [ ] Security scripts are executable

## OWASP References

This guide addresses the following OWASP concerns:

- **A01:2021 - Broken Access Control**: SSH hardening, user permissions
- **A02:2021 - Cryptographic Failures**: TLS 1.2/1.3, strong ciphers
- **A03:2021 - Injection**: Input validation via nginx, CSP headers
- **A05:2021 - Security Misconfiguration**: Hardened configs throughout
- **A06:2021 - Vulnerable Components**: npm audit, automatic updates
- **A07:2021 - Authentication Failures**: fail2ban, rate limiting
- **A09:2021 - Security Logging**: Comprehensive logging and monitoring
