# =================================================================
# Этап 1: "builder" - Установка зависимостей и сборка проекта
# =================================================================
FROM oven/bun:1 AS builder

WORKDIR /usr/src/app

COPY package.json ./
RUN bun install --ignore-scripts

COPY . .

RUN bun run build:web


# =================================================================
# Этап 2: "release" - Создание финального образа для production
# =================================================================
FROM oven/bun:1-slim AS release

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

CMD ["bun", "run", "dist/index.js"]
