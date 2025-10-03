FROM oven/bun:1-slim

# Устанавливаем системные зависимости для библиотеки sharp
# Это можно делать в одном слое с установкой bun-зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends libvips-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=8080

# --- Оптимизированное копирование и установка ---
# 1. Копируем ТОЛЬКО package.json и bun.lockb
COPY package.json bun.lock ./

# 2. Устанавливаем ТОЛЬКО production-зависимости, используя лок-файл.
# Это гарантирует, что в образе будут те же самые версии пакетов, что и у вас локально.
RUN bun install --production --frozen-lockfile

# 3. Копируем весь остальной код проекта
COPY . .
# ---------------------------------------------

# Меняем владельца, чтобы не работать под root
RUN chown -R bun:bun /usr/src/app
USER bun

# Открываем порт
EXPOSE 8080

# Проверка работоспособности (можно оставить, если есть роут /)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# --- ГЛАВНОЕ ИЗМЕНЕНИЕ ---
# Запускаем приложение напрямую из исходников, а не из папки dist
CMD ["bun", "run", "src/index.ts"]
