#!/bin/bash
# ===========================================
# VPS SECURITY HARDENING SCRIPT
# calendarsolunar.ro
# ===========================================
#
# USAGE:
# 1. Copy this script to your VPS
# 2. Make executable: chmod +x vps-security-setup.sh
# 3. Run as root: sudo ./vps-security-setup.sh
#
# IMPORTANT: Run this on a FRESH Ubuntu VPS installation
# Keep a separate SSH session open during setup!
# ===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration - MODIFY THESE
NEW_SSH_PORT=2222
DEPLOY_USER="solunar"
DOMAIN="calendarsolunar.ro"
APP_PORT=3500

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}VPS Security Hardening Script${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (sudo ./vps-security-setup.sh)${NC}"
    exit 1
fi

# Confirm before proceeding
echo -e "${YELLOW}WARNING: This script will make significant changes to your system.${NC}"
echo -e "${YELLOW}Make sure you have a backup SSH session open!${NC}"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# ===========================================
# PHASE 1: System Update and Essential Packages
# ===========================================
echo ""
echo -e "${GREEN}[PHASE 1] Updating system and installing packages...${NC}"

apt update && apt upgrade -y

apt install -y \
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
    gnupg2 \
    git \
    inotify-tools \
    nginx \
    certbot \
    python3-certbot-nginx

echo -e "${GREEN}[PHASE 1] Complete${NC}"

# ===========================================
# PHASE 2: Create Deploy User
# ===========================================
echo ""
echo -e "${GREEN}[PHASE 2] Creating deploy user...${NC}"

if id "$DEPLOY_USER" &>/dev/null; then
    echo "User $DEPLOY_USER already exists"
else
    useradd -m -s /bin/bash $DEPLOY_USER
    usermod -aG sudo $DEPLOY_USER
    echo -e "${YELLOW}Set password for $DEPLOY_USER:${NC}"
    passwd $DEPLOY_USER
fi

# Create SSH directory for deploy user
mkdir -p /home/$DEPLOY_USER/.ssh
chmod 700 /home/$DEPLOY_USER/.ssh
touch /home/$DEPLOY_USER/.ssh/authorized_keys
chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys
chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh

echo -e "${YELLOW}IMPORTANT: Add your SSH public key to /home/$DEPLOY_USER/.ssh/authorized_keys${NC}"
echo -e "${YELLOW}You can do this now or after the script completes.${NC}"
read -p "Press Enter to continue..."

echo -e "${GREEN}[PHASE 2] Complete${NC}"

# ===========================================
# PHASE 3: SSH Hardening
# ===========================================
echo ""
echo -e "${GREEN}[PHASE 3] Hardening SSH...${NC}"

# Backup original config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d)

# Create hardened SSH config
cat > /etc/ssh/sshd_config << EOF
# Hardened SSH Configuration
Port $NEW_SSH_PORT
AddressFamily inet
ListenAddress 0.0.0.0

Protocol 2
HostKey /etc/ssh/ssh_host_ed25519_key
HostKey /etc/ssh/ssh_host_rsa_key

Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512,hmac-sha2-256
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512

PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
AuthenticationMethods publickey

MaxAuthTries 3
MaxSessions 3
LoginGraceTime 30

AllowTcpForwarding no
X11Forwarding no
AllowAgentForwarding no
PermitTunnel no

ClientAliveInterval 300
ClientAliveCountMax 2
TCPKeepAlive yes

SyslogFacility AUTH
LogLevel VERBOSE

AllowUsers $DEPLOY_USER

Banner /etc/ssh/banner

Subsystem sftp /usr/lib/openssh/sftp-server -f AUTHPRIV -l INFO

KerberosAuthentication no
GSSAPIAuthentication no
HostbasedAuthentication no
EOF

# Create SSH banner
cat > /etc/ssh/banner << 'EOF'
***************************************************************************
                            AUTHORIZED ACCESS ONLY
***************************************************************************
This system is for authorized users only. All activity is logged.
***************************************************************************
EOF

# Regenerate host keys
rm -f /etc/ssh/ssh_host_*
ssh-keygen -t ed25519 -f /etc/ssh/ssh_host_ed25519_key -N ""
ssh-keygen -t rsa -b 4096 -f /etc/ssh/ssh_host_rsa_key -N ""
chmod 600 /etc/ssh/ssh_host_*
chmod 644 /etc/ssh/ssh_host_*.pub

echo -e "${GREEN}[PHASE 3] Complete${NC}"

# ===========================================
# PHASE 4: Firewall Configuration
# ===========================================
echo ""
echo -e "${GREEN}[PHASE 4] Configuring firewall...${NC}"

ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw limit $NEW_SSH_PORT/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw deny 22/tcp comment 'Block default SSH'
ufw logging on
ufw --force enable

echo -e "${GREEN}[PHASE 4] Complete${NC}"

# ===========================================
# PHASE 5: Fail2ban Configuration
# ===========================================
echo ""
echo -e "${GREEN}[PHASE 5] Configuring fail2ban...${NC}"

cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 24h
findtime = 10m
maxretry = 3
ignoreip = 127.0.0.1/8 ::1
backend = systemd

[sshd]
enabled = true
port = $NEW_SSH_PORT
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 7d
findtime = 10m

[sshd-aggressive]
enabled = true
port = $NEW_SSH_PORT
filter = sshd[mode=aggressive]
logpath = /var/log/auth.log
maxretry = 2
bantime = 30d

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

[recidive]
enabled = true
logpath = /var/log/fail2ban.log
banaction = %(banaction_allports)s
bantime = 1w
findtime = 1d
maxretry = 5
EOF

# Create nginx filters
cat > /etc/fail2ban/filter.d/nginx-limit-req.conf << 'EOF'
[Definition]
failregex = limiting requests, excess:.* by zone.*client: <HOST>
ignoreregex =
EOF

systemctl enable fail2ban
systemctl restart fail2ban

echo -e "${GREEN}[PHASE 5] Complete${NC}"

# ===========================================
# PHASE 6: Kernel Hardening
# ===========================================
echo ""
echo -e "${GREEN}[PHASE 6] Hardening kernel...${NC}"

cat > /etc/sysctl.d/99-security-hardening.conf << 'EOF'
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0
net.ipv4.tcp_rfc1337 = 1
fs.file-max = 65535
net.ipv4.ip_local_port_range = 2000 65000
net.core.somaxconn = 65535
kernel.yama.ptrace_scope = 2
kernel.dmesg_restrict = 1
kernel.kptr_restrict = 2
kernel.randomize_va_space = 2
EOF

sysctl -p /etc/sysctl.d/99-security-hardening.conf

echo -e "${GREEN}[PHASE 6] Complete${NC}"

# ===========================================
# PHASE 7: Automatic Updates
# ===========================================
echo ""
echo -e "${GREEN}[PHASE 7] Configuring automatic updates...${NC}"

cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

cat > /etc/apt/apt.conf.d/20auto-upgrades << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Download-Upgradeable-Packages "1";
EOF

systemctl enable unattended-upgrades
systemctl start unattended-upgrades

echo -e "${GREEN}[PHASE 7] Complete${NC}"

# ===========================================
# PHASE 8: Node.js Installation
# ===========================================
echo ""
echo -e "${GREEN}[PHASE 8] Installing Node.js...${NC}"

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2

echo -e "${GREEN}[PHASE 8] Complete${NC}"

# ===========================================
# PHASE 9: Application Directory Setup
# ===========================================
echo ""
echo -e "${GREEN}[PHASE 9] Setting up application directory...${NC}"

mkdir -p /var/www/solunar
mkdir -p /var/log/pm2
chown -R $DEPLOY_USER:$DEPLOY_USER /var/www/solunar
chown -R $DEPLOY_USER:$DEPLOY_USER /var/log/pm2
chmod 750 /var/www/solunar

echo -e "${GREEN}[PHASE 9] Complete${NC}"

# ===========================================
# PHASE 10: Security Tools Setup
# ===========================================
echo ""
echo -e "${GREEN}[PHASE 10] Setting up security tools...${NC}"

# Initialize AIDE
aideinit
cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db 2>/dev/null || true

# Update rkhunter
rkhunter --update || true
rkhunter --propupd || true

# Enable auditd
systemctl enable auditd
systemctl start auditd

echo -e "${GREEN}[PHASE 10] Complete${NC}"

# ===========================================
# PHASE 11: Create Security Scripts
# ===========================================
echo ""
echo -e "${GREEN}[PHASE 11] Creating security scripts...${NC}"

# Quick security check script
cat > /usr/local/bin/quick-security-check << 'SCRIPT'
#!/bin/bash
echo "=== Quick Security Check: $(date) ==="
echo ""
FAILED_SSH=$(grep "Failed password" /var/log/auth.log 2>/dev/null | grep "$(date '+%b %d %H')" | wc -l)
echo "[SSH] Failed login attempts (last hour): $FAILED_SSH"
F2B_BANS=$(sudo fail2ban-client status 2>/dev/null | grep "Currently banned" | awk '{sum+=$NF} END {print sum}')
echo "[F2B] Currently banned IPs: ${F2B_BANS:-0}"
echo ""
echo "[SERVICES]"
systemctl is-active --quiet nginx && echo "  Nginx: RUNNING" || echo "  Nginx: STOPPED"
systemctl is-active --quiet fail2ban && echo "  Fail2ban: RUNNING" || echo "  Fail2ban: STOPPED"
systemctl is-active --quiet ufw && echo "  UFW: RUNNING" || echo "  UFW: STOPPED"
pm2 list 2>/dev/null | grep -q "online" && echo "  PM2 App: RUNNING" || echo "  PM2 App: CHECK"
echo ""
echo "[RESOURCES]"
echo "  Disk: $(df -h / | awk 'NR==2 {print $5}')"
echo "  Memory: $(free | awk 'NR==2 {printf "%.0f%%", $3*100/$2}')"
echo "  Load:$(uptime | awk -F'load average:' '{print $2}')"
echo ""
CRYPTO=$(ps aux | grep -iE "(miner|xmr|crypto|stratum)" | grep -v grep | wc -l)
[ $CRYPTO -gt 0 ] && echo "[WARNING] Potential crypto miner detected!" || echo "[OK] No mining processes"
echo ""
echo "=== Check Complete ==="
SCRIPT
chmod +x /usr/local/bin/quick-security-check

# Fail2ban management script
cat > /usr/local/bin/f2b-manage << 'SCRIPT'
#!/bin/bash
case "$1" in
    status) sudo fail2ban-client status ;;
    banned)
        echo "=== All Banned IPs ==="
        for jail in $(sudo fail2ban-client status | grep "Jail list" | sed 's/.*://;s/,//g'); do
            echo "--- $jail ---"
            sudo fail2ban-client status $jail | grep "Banned IP"
        done ;;
    unban)
        if [ -z "$2" ]; then echo "Usage: f2b-manage unban <IP>"; exit 1; fi
        for jail in $(sudo fail2ban-client status | grep "Jail list" | sed 's/.*://;s/,//g'); do
            sudo fail2ban-client set $jail unbanip $2 2>/dev/null
        done
        echo "Unbanned $2 from all jails" ;;
    reload) sudo fail2ban-client reload ;;
    *) echo "Usage: f2b-manage {status|banned|unban <IP>|reload}" ;;
esac
SCRIPT
chmod +x /usr/local/bin/f2b-manage

echo -e "${GREEN}[PHASE 11] Complete${NC}"

# ===========================================
# PHASE 12: Final SSH Restart
# ===========================================
echo ""
echo -e "${YELLOW}=========================================${NC}"
echo -e "${YELLOW}IMPORTANT: Before restarting SSH${NC}"
echo -e "${YELLOW}=========================================${NC}"
echo ""
echo -e "${YELLOW}1. Ensure you have added your SSH public key to:${NC}"
echo -e "${YELLOW}   /home/$DEPLOY_USER/.ssh/authorized_keys${NC}"
echo ""
echo -e "${YELLOW}2. Test SSH connection in a NEW terminal:${NC}"
echo -e "${YELLOW}   ssh -p $NEW_SSH_PORT $DEPLOY_USER@<your-vps-ip>${NC}"
echo ""
echo -e "${YELLOW}3. Keep this session open until you confirm access!${NC}"
echo ""
read -p "Have you added your SSH key and are ready to restart SSH? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Test SSH config
    sshd -t
    if [ $? -eq 0 ]; then
        systemctl restart sshd
        echo -e "${GREEN}SSH restarted successfully${NC}"
    else
        echo -e "${RED}SSH config error! Not restarting.${NC}"
        echo -e "${RED}Fix the config and run: systemctl restart sshd${NC}"
    fi
else
    echo -e "${YELLOW}SSH not restarted. Run manually when ready:${NC}"
    echo -e "${YELLOW}  sudo sshd -t && sudo systemctl restart sshd${NC}"
fi

# ===========================================
# SUMMARY
# ===========================================
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}SETUP COMPLETE${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Test SSH access: ssh -p $NEW_SSH_PORT $DEPLOY_USER@<vps-ip>"
echo "2. Configure Nginx: See VPS_SECURITY_HARDENING.md"
echo "3. Set up SSL: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "4. Deploy your application to /var/www/solunar"
echo "5. Run: quick-security-check"
echo ""
echo "Security commands:"
echo "  quick-security-check  - Quick health check"
echo "  f2b-manage status     - Fail2ban status"
echo "  f2b-manage banned     - View banned IPs"
echo "  sudo ufw status       - Firewall status"
echo ""
echo -e "${GREEN}=========================================${NC}"
