#!/bin/sh
# =====================================================================
# TrailTales — pull & run from Docker Hub
#
# Usage:
#   chmod +x run.sh
#   ./run.sh <dockerhub-image>
#
# Example:
#   ./run.sh muhammadali/trailtales:latest
#
# Prerequisites on EC2:
#   - Docker installed
#   - .env file present in the same directory as this script
# =====================================================================

IMAGE="${1}"

if [ -z "${IMAGE}" ]; then
  echo "Error: no image specified."
  echo "Usage: ./run.sh <dockerhub-user>/trailtales:latest"
  exit 1
fi

# Read PORT from .env (falls back to 5000 if not set)
PORT=$(grep -E '^PORT=' .env 2>/dev/null | cut -d= -f2 | tr -d '[:space:]')
PORT="${PORT:-5000}"

echo ">>> Pulling image: ${IMAGE}"
docker pull "${IMAGE}"

echo ">>> Stopping & removing old container (if any)..."
docker stop trailtales 2>/dev/null || true
docker rm   trailtales 2>/dev/null || true

echo ">>> Starting container on port ${PORT}..."
docker run -d \
  --name trailtales \
  --restart unless-stopped \
  --env-file .env \
  -p "${PORT}:${PORT}" \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=5 \
  "${IMAGE}"

echo ""
echo "Container is up. Verify:"
echo "  docker ps"
echo "  curl http://localhost:${PORT}/api/health"
