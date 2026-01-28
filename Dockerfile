# Build stage
FROM node:20-alpine AS builder

# Security: Set build arguments
ARG NODE_ENV=production

WORKDIR /app

# Security: Create non-root user for build stage
RUN addgroup -g 1000 -S nodejs && \
    adduser -S nestjs -u 1000

# Copy package files
COPY package*.json ./

# Security: Install dependencies with audit fix
RUN npm ci --only=production=false && \
    npm audit fix --force || true

# Copy source code
COPY --chown=nestjs:nodejs . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Security: Set production arguments
ARG NODE_ENV=production

# Security: Install security updates
RUN apk update && \
    apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Security: Create non-root user
RUN addgroup -g 1000 -S nodejs && \
    adduser -S nestjs -u 1000 -G nodejs

WORKDIR /app

# Security: Set ownership before copying files
RUN chown -R nestjs:nodejs /app

# Copy package files
COPY --chown=nestjs:nodejs package*.json ./

# Security: Install only production dependencies and audit
RUN npm ci --only=production && \
    npm audit --production || true && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Security: Create necessary directories with proper permissions
RUN mkdir -p /app/uploads /tmp /var/run && \
    chown -R nestjs:nodejs /app/uploads /tmp /var/run && \
    chmod -R 755 /app/uploads

# Security: Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Security: Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/main.js"]
