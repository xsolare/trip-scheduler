# =================================================================
# Этап 1: "builder" - Установка зависимостей и сборка проекта
# =================================================================
FROM oven/bun:1 as builder

WORKDIR /usr/src/app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build


# =================================================================
# Этап 2: "release" - Создание финального образа для production
# =================================================================
FROM oven/bun:1-slim as release

ENV NODE_ENV=production
ENV PORT=8080

# Создаем непривилегированного пользователя для повышения безопасности
RUN addgroup --system --gid 1001 bun
RUN adduser --system --uid 1001 --gid 1001 bun

# Устанавливаем рабочую директорию и передаем права новому пользователю
WORKDIR /usr/src/app
RUN chown -R bun:bun /usr/src/app

# Копируем только необходимые для запуска артефакты из этапа "builder"
COPY --chown=bun:bun --from=builder /usr/src/app/dist ./dist
COPY --chown=bun:bun --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=bun:bun --from=builder /usr/src/app/package.json ./package.json

# Переключаемся на непривилегированного пользователя
USER bun

# Открываем порт, на котором будет работать приложение
EXPOSE 8080

# Добавляем проверку состояния для оркестраторов (Kubernetes, Docker Swarm)
# Проверяем, что сервер отвечает на запросы, а не просто запущен
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

CMD ["bun", "run", "dist/index.js"]
