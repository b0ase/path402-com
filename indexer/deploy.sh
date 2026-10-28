#!/bin/bash
# Deploy PATH402 Indexer to Hetzner VPS

set -e

echo "Deploying PATH402 Indexer..."

# Create directory on server
ssh hetzner "sudo mkdir -p /opt/path402-indexer && sudo chown \$USER:\$USER /opt/path402-indexer"

# Copy files
scp index.js package.json path402-indexer.service hetzner:/opt/path402-indexer/

# The .env on the server holds the Supabase credentials. It is created by hand once and never
# written from this script, so no key is committed here:
#   SUPABASE_URL=http://localhost:8000
#   SUPABASE_SERVICE_KEY=<the server's service-role key>
ssh hetzner "test -f /opt/path402-indexer/.env" || { echo "Create /opt/path402-indexer/.env on the server first (see above)."; exit 1; }

# Install dependencies
ssh hetzner "cd /opt/path402-indexer && npm install --production"

# Install systemd service
ssh hetzner "sudo cp /opt/path402-indexer/path402-indexer.service /etc/systemd/system/"
ssh hetzner "sudo systemctl daemon-reload"
ssh hetzner "sudo systemctl enable path402-indexer"
ssh hetzner "sudo systemctl restart path402-indexer"

echo ""
echo "Deployed! Check status with:"
echo "  ssh hetzner 'systemctl status path402-indexer'"
echo "  ssh hetzner 'journalctl -u path402-indexer -f'"
