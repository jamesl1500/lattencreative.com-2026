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

# ─── 2. Check disk space ───
AVAIL_MB=$(df -m "$APP_DIR" | awk 'NR==2 {print $4}')
echo "→ Available disk space: ${AVAIL_MB}MB"
if [ "$AVAIL_MB" -lt 2000 ]; then
    echo "⚠  Low disk space! Cleaning up..."
    npm cache clean --force
    rm -rf node_modules/.cache
fi

# ─── 3. Clean previous build artifacts ───
echo "→ Cleaning old builds..."
rm -rf apps/web/.next
rm -rf apps/dashboard/.next
rm -rf apps/studio/dist
rm -rf node_modules/.cache/turbo

# ─── 4. Install dependencies ───
echo "→ Installing dependencies..."
npm install --production=false

# ─── 5. Build all apps with Turbo ───
echo "→ Building apps..."
npx turbo build --concurrency=1

# ─── 6. Build Sanity Studio (static files) ───
echo "→ Building Sanity Studio..."
cd apps/studio
npx sanity build
cd "$APP_DIR"

# ─── 7. Sync Nginx configs (in case they changed) ───
echo "→ Syncing Nginx configs..."
cp deploy/nginx/*.conf /etc/nginx/sites-available/ 2>/dev/null || true
nginx -t && systemctl reload nginx

# ─── 8. Restart PM2 apps ───
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
