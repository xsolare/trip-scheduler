# =================================================================
# Этап 1: "builder" - Установка зависимостей и сборка клиента
# =================================================================
FROM oven/bun:1 AS builder

WORKDIR /usr/src/app

ARG VITE_APP_SERVER_URL
ARG VITE_APP_SERVER_STATIC_PATH
ARG VITE_APP_TRPC_MODE
ARG VITE_APP_MOCK_MODE
ARG VITE_APP_REQUEST_THROTTLE

COPY package.json bun.lock ./
RUN bun install --ignore-scripts

COPY . .

RUN bun --cwd ./apps/client run build:web

# =================================================================
# Этап 2: "release" - Создание финального образа с Nginx
# =================================================================
FROM nginx:stable-alpine

COPY --from=builder /usr/src/app/apps/client/dist-web /usr/share/nginx/html

COPY deployment/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 1420

CMD ["nginx", "-g", "daemon off;"]
