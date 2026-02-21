#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
# Deploy Script — Run on EC2 after initial setup.
# Pulls latest code, installs deps, builds, and restarts.
#
#   cd /var/www/lattencreative && bash deploy/deploy.sh
# ═══════════════════════════════════════════════════════════
set -euo pipefail

APP_DIR="/var/www/lattencreative"
BRANCH="${1:-master}"

echo "══════════════════════════════════════"
echo "  Deploying Latten Creative"
echo "  Branch: $BRANCH"
echo "══════════════════════════════════════"

cd "$APP_DIR"

# ─── 1. Pull latest code ───
echo "→ Pulling latest code..."
git fetch origin
git reset --hard "origin/$BRANCH"

# ─── 2. Install dependencies ───
echo "→ Installing dependencies..."
npm install --production=false

# ─── 3. Build all apps with Turbo ───
# Limit Node heap to 512MB and build one app at a time to avoid OOM
echo "→ Building apps..."
NODE_OPTIONS="--max-old-space-size=512" npx turbo build --concurrency=1

# ─── 4. Build Sanity Studio (static files) ───
echo "→ Building Sanity Studio..."
cd apps/studio
npx sanity build
cd "$APP_DIR"

# ─── 5. Sync Nginx configs (in case they changed) ───
echo "→ Syncing Nginx configs..."
cp deploy/nginx/*.conf /etc/nginx/sites-available/ 2>/dev/null || true
nginx -t && systemctl reload nginx

# ─── 6. Restart PM2 apps ───
echo "→ Restarting apps..."
if pm2 describe latten-web &>/dev/null; then
    pm2 restart deploy/ecosystem.config.cjs
else
    pm2 start deploy/ecosystem.config.cjs
fi
pm2 save

echo ""
echo "══════════════════════════════════════"
echo "  Deploy complete! ✓"
echo "══════════════════════════════════════"
echo ""
echo "  Web:       https://lattencreative.com"
echo "  Dashboard: https://dashboard.lattencreative.com"
echo "  Studio:    https://studio.lattencreative.com"
echo ""
