#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
# EC2 One-Time Setup Script (Ubuntu 22.04 / 24.04)
# Run as root or with sudo on a fresh EC2 instance.
#
#   curl -sL <gist-url> | sudo bash
#   — or —
#   sudo bash deploy/setup.sh
# ═══════════════════════════════════════════════════════════
set -euo pipefail

echo "══════════════════════════════════════"
echo "  Latten Creative — EC2 Setup"
echo "══════════════════════════════════════"

# ─── 1. System Updates ───
echo "→ Updating system packages..."
apt-get update -y && apt-get upgrade -y

# ─── 2. Install Node.js 22 LTS (via NodeSource) ───
echo "→ Installing Node.js 22..."
if ! command -v node &>/dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi
echo "  Node $(node -v) | npm $(npm -v)"

# ─── 3. Install PM2 globally ───
echo "→ Installing PM2..."
npm install -g pm2
pm2 install pm2-logrotate

# ─── 4. Install Nginx ───
echo "→ Installing Nginx..."
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx

# ─── 5. Install Certbot (Let's Encrypt SSL) ───
echo "→ Installing Certbot..."
apt-get install -y certbot python3-certbot-nginx

# ─── 6. Install Git ───
echo "→ Installing Git..."
apt-get install -y git

# ─── 7. Create swap space (2GB) for builds ───
if [ ! -f /swapfile ]; then
    echo "→ Creating 2GB swap file..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "  Swap enabled (2GB)"
else
    echo "→ Swap already exists, skipping."
fi

# ─── 8. Create app directory ───
echo "→ Creating /var/www/lattencreative..."
mkdir -p /var/www/lattencreative
mkdir -p /var/log/pm2

# ─── 9. Firewall (UFW) ───
echo "→ Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo ""
echo "══════════════════════════════════════"
echo "  Setup complete!"
echo "══════════════════════════════════════"
echo ""
echo "Next steps:"
echo ""
echo "  1. Clone the repo:"
echo "     cd /var/www/lattencreative"
echo "     git clone git@github.com:jamesl1500/lattencreative.com-2026.git ."
echo ""
echo "  2. Create .env file:"
echo "     cp .env.example .env  # then fill in production values"
echo ""
echo "  3. Install & build:"
echo "     npm install"
echo "     npx turbo build"
echo "     cd apps/studio && npx sanity build && cd ../.."
echo ""
echo "  4. Copy Nginx configs:"
echo "     cp deploy/nginx/*.conf /etc/nginx/sites-available/"
echo "     ln -sf /etc/nginx/sites-available/web.conf /etc/nginx/sites-enabled/"
echo "     ln -sf /etc/nginx/sites-available/dashboard.conf /etc/nginx/sites-enabled/"
echo "     ln -sf /etc/nginx/sites-available/studio.conf /etc/nginx/sites-enabled/"
echo "     rm -f /etc/nginx/sites-enabled/default"
echo "     nginx -t && systemctl reload nginx"
echo ""
echo "  5. Provision SSL certificates:"
echo "     certbot --nginx -d lattencreative.com -d www.lattencreative.com"
echo "     certbot --nginx -d dashboard.lattencreative.com"
echo "     certbot --nginx -d studio.lattencreative.com"
echo ""
echo "  6. Start the apps:"
echo "     pm2 start deploy/ecosystem.config.cjs"
echo "     pm2 save"
echo "     pm2 startup   # follow the printed command to persist across reboots"
echo ""
echo "  7. Update Stripe webhook URL in Stripe Dashboard:"
echo "     https://lattencreative.com/api/webhooks/stripe"
echo ""
echo "  8. Update Supabase → Authentication → URL Configuration:"
echo "     Site URL:     https://lattencreative.com"
echo "     Redirect URLs: https://dashboard.lattencreative.com/**"
echo ""
