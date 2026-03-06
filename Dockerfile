# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

COPY package.json ./
# Note: package-lock.json is used as source if pnpm-lock.yaml is missing
COPY package-lock.json* ./ 

RUN pnpm install --no-frozen-lockfile

# Stage 2: Build the application
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm run build

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy essential files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
