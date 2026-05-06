# =====================================================================
# TrailTales — single-container Dockerfile
# Stage 1: build the React (Vite) client into static files
# Stage 2: install only the server's production deps
# Stage 3: tiny runtime that serves API + the built React bundle
#
# Result: ONE container, ONE process, ONE port.
# Mount your .env at runtime (or use --env-file). When the EC2 IP
# changes, you only update the .env file (CORS_ORIGIN, PUBLIC_URL).
# =====================================================================

# ---------- Stage 1: build client ----------
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --no-audit --no-fund
COPY client/ ./
RUN npm run build

# ---------- Stage 2: install server prod deps ----------
FROM node:20-alpine AS server-deps
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# ---------- Stage 3: runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app

# Run as non-root for safety
RUN addgroup -S app && adduser -S app -G app

# Copy server source + node_modules
COPY --from=server-deps /app/server/node_modules ./server/node_modules
COPY server ./server

# Copy built client into the place server.js expects (../client/dist)
COPY --from=client-build /app/client/dist ./client/dist

ENV NODE_ENV=production
# PORT can still be overridden via .env; this is just the default.
ENV PORT=5000
EXPOSE 5000

USER app

# Healthcheck hits the /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT:-5000}/api/health || exit 1

CMD ["node", "server/server.js"]
