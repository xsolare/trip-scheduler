# =================================================================
# Этап 1: "builder" - Установка зависимостей и сборка клиента
# =================================================================
FROM oven/bun:1 as builder

WORKDIR /usr/src/app

# Принимаем переменные окружения как аргументы сборки
ARG VITE_APP_SERVER_URL
ARG VITE_APP_TRPC_MODE
ARG VITE_APP_MOCK_MODE
ARG VITE_APP_REQUEST_THROTTLE

# Копируем package.json и bun.lockb для кэширования зависимостей
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Копируем весь исходный код
COPY . .

# Собираем клиентское приложение, используя переданные аргументы
RUN VITE_APP_SERVER_URL=${VITE_APP_SERVER_URL} \
    VITE_APP_TRPC_MODE=${VITE_APP_TRPC_MODE} \
    VITE_APP_MOCK_MODE=${VITE_APP_MOCK_MODE} \
    VITE_APP_REQUEST_THROTTLE=${VITE_APP_REQUEST_THROTTLE} \
    bun --cwd ./apps/client run build:web

# =================================================================
# Этап 2: "release" - Создание финального образа с Nginx
# =================================================================
FROM nginx:stable-alpine

# Копируем только собранные статические файлы из этапа "builder"
COPY --from=builder /usr/src/app/apps/client/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY docker/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
