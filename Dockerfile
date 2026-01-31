FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /root/.pnpm-store /root/.pnpm-store
COPY --from=builder /app/node_modules ./node_modules

RUN mkdir -p uploads

EXPOSE 4000
CMD ["node", "dist/main"]