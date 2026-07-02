#!/usr/bin/env bash
# ==============================================================================
# Setup complet VPS nou pentru calendarsolunar.ro (Ubuntu 22.04 / 24.04)
#
# Ruleaza ca root pe VPS-ul proaspat:
#   bash setup-vps.sh [URL_GIT_OPTIONAL]
#
# Codul aplicatiei ajunge pe server in /var/www/solunar prin UNA din variante:
#   a) dai URL-ul de git ca argument -> scriptul face clone singur
#   b) il urci manual INAINTE de a rula scriptul, de pe Windows:
#      scp -r C:\Users\Silviu\Downloads\Solunar root@IP_NOU:/var/www/solunar
#      (exclude node_modules si .next — se regenereaza pe server)
#
# IMPORTANT inainte de certificatul SSL (pasul certbot):
#   schimba inregistrarea DNS A pentru calendarsolunar.ro si www -> IP-ul NOU.
#   Certbot esueaza daca DNS-ul inca arata spre IP-ul vechi.
# ==============================================================================
set -euo pipefail

APP_DIR=/var/www/solunar
GIT_URL="${1:-}"
DOMAIN=calendarsolunar.ro

echo "==> [1/9] Pachete de baza"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y nginx git curl ufw certbot python3-certbot-nginx rsync

echo "==> [2/9] Swap 2G (protejeaza build-ul Next.js pe RAM putin)"
if ! swapon --show | grep -q '/swapfile'; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "==> [3/9] Node.js 20 + PM2"
if ! command -v node >/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
npm install -g pm2

echo "==> [4/9] Codul aplicatiei"
if [[ ! -d "$APP_DIR" ]]; then
    if [[ -n "$GIT_URL" ]]; then
        git clone "$GIT_URL" "$APP_DIR"
    else
        echo "EROARE: $APP_DIR nu exista si nu ai dat un URL de git."
        echo "Urca intai codul (vezi instructiunile din antetul scriptului) si ruleaza din nou."
        exit 1
    fi
fi
cd "$APP_DIR"

echo "==> [5/9] Build de productie"
npm ci
npm run build
# Modul standalone: serverul are nevoie de static si public lânga server.js
rm -rf .next/standalone/.next/static .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

echo "==> [6/9] PM2 (porneste aplicatia pe portul 3500 si la reboot)"
pm2 delete solunar 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash || true

echo "==> [7/9] Nginx"
cp "$APP_DIR/nginx/calendarsolunar.ro.conf" /etc/nginx/sites-available/$DOMAIN.conf
ln -sf /etc/nginx/sites-available/$DOMAIN.conf /etc/nginx/sites-enabled/$DOMAIN.conf
rm -f /etc/nginx/sites-enabled/default
# Configul din repo refera certificatele Let's Encrypt care nu exista inca la
# prima rulare — pornim nginx doar pe 80 pana emitem certificatul.
if ! nginx -t 2>/dev/null; then
    cat > /etc/nginx/sites-enabled/$DOMAIN.conf <<BOOTSTRAP
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    location / {
        proxy_pass http://127.0.0.1:3500;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
BOOTSTRAP
    nginx -t
fi
systemctl enable --now nginx
systemctl reload nginx

echo "==> [8/9] Firewall"
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "==> [9/9] Certificat SSL (necesita DNS-ul deja mutat pe acest IP!)"
if certbot certonly --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m gaitansilviu93@yahoo.com; then
    # Acum ca certificatul exista, activam configul complet din repo (cu 443).
    cp "$APP_DIR/nginx/calendarsolunar.ro.conf" /etc/nginx/sites-enabled/$DOMAIN.conf
    nginx -t && systemctl reload nginx
    echo "SSL OK."
else
    echo "ATENTIE: certbot a esuat — probabil DNS-ul nu arata inca spre acest IP."
    echo "Dupa ce muti DNS-ul, ruleaza manual:"
    echo "  certbot certonly --nginx -d $DOMAIN -d www.$DOMAIN"
    echo "  cp $APP_DIR/nginx/calendarsolunar.ro.conf /etc/nginx/sites-enabled/$DOMAIN.conf && nginx -t && systemctl reload nginx"
fi

echo ""
echo "=============================================================="
echo " GATA. Verificari finale:"
echo "   curl -I https://$DOMAIN/            (200)"
echo "   curl -I https://www.$DOMAIN/        (301 -> non-www)"
echo "   curl https://$DOMAIN/ads.txt        (google.com, pub-4509784482094331...)"
echo "   pm2 status                          (solunar online)"
echo ""
echo " Pasi ramasi (manual):"
echo "   1. UptimeRobot pe https://$DOMAIN/ (alerta cand pica)"
echo "   2. node scripts/indexnow-submit.js  (anunta Bing)"
echo "   3. Google Search Console -> Inspectare URL -> Solicita indexare pe /"
echo "   4. AdSense -> Confidentialitate si mesaje -> publica mesajul GDPR"
echo "=============================================================="
