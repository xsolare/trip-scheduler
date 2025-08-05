# Trip Scheduler API

Это бэкенд-сервис для приложения по планированию путешествий. Он построен с использованием Hono, tRPC и Drizzle ORM, и работает на Bun.

## Содержание

- [Технологии](#технологии)
- [Требования](#требования)
- [Локальная разработка](#локальная-разработка)
  - [1. Запуск базы данных](#1-запуск-базы-данных)
  - [2. Запуск сервера](#3-запуск-сервера)
- [Доступные скрипты](#доступные-скрипты)
- [API](#api)
- [Сборка и запуск в Docker](#сборка-и-запуск-в-docker)
  - [1. Создание Dockerfile](#1-создание-dockerfile)
  - [2. Сборка образа](#2-сборка-образа)
  - [3. Запуск контейнера](#3-запуск-контейнера)

## Технологии

- **Среда выполнения:** [Bun](https://bun.sh/)
- **Фреймворк:** [Hono](https://hono.dev/)
- **API:** [tRPC](https://trpc.io/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **База данных:** [PostgreSQL](https://www.postgresql.org/)
- **Язык:** [TypeScript](https://www.typescriptlang.org/)

## Требования

Для локальной разработки вам понадобятся:

- **[Bun](https://bun.sh/docs/installation)** (v1.1.0 или выше)
- **[Docker](https://www.docker.com/get-started/)** и Docker Compose

## Локальная разработка

### 1. Запуск базы данных

Для корректной работы приложения необходима запущенная база данных PostgreSQL. Используйте команду ниже, чтобы запустить контейнер Docker с нужными параметрами (взяты из `drizzle.config.ts`).

```bash
docker run -p 5432:5432 \
  --name trip-scheduler-db \
  -e POSTGRES_USER=trip-scheduler \
  -e POSTGRES_PASSWORD=trip-scheduler \
  -e POSTGRES_DB=trip_scheduler_dev \
  -d \
  --restart always \
  postgres:latest
```

#### Подключтся к базе и посмотреть ID

```bash
docker exec -it trip-scheduler-db psql -U trip-scheduler -d trip_scheduler_dev -c "SELECT id, title FROM days;"
```

### 2. Запуск сервера

Запустите сервер в режиме разработки с автоматической перезагрузкой при изменениях.

> **Примечание:** Если вы хотите сбросить базу данных и накатить всё с нуля, можно выполнить команды `db:migrate` и `db:seed` последовательно.

```bash
bun run dev
```

После успешного запуска вы увидите в консоли:

```
🚀 Trip Scheduler API starting...
📍 Server running at http://0.0.0.0:8080
```

Сервер будет доступен по адресу `http://localhost:8080`.

## Доступные скрипты

В файле `package.json` определены следующие скрипты:

| Скрипт                | Описание                                                                  |
| :-------------------- | :------------------------------------------------------------------------ |
| `bun run dev`         | Запускает сервер в режиме разработки с hot-reload.                        |
| `bun run db:migrate`  | Применяет существующие миграции к базе данных.                            |
| `bun run db:seed`     | Заполняет базу данных начальными (тестовыми) данными.                     |
| `bun run db:generate` | Генерирует новые файлы миграций на основе изменений в `src/db/schema.ts`. |
| `bun run lint`        | Проверяет код на соответствие правилам ESLint.                            |
| `bun run build`       | Собирает production-версию приложения в папку `dist/`.                    |
| `bun run start`       | Запускает собранную версию приложения из папки `dist/`.                   |

## API

Сервер предоставляет **tRPC API**.

- **Endpoint:** `http://localhost:8080/trpc`
- Для взаимодействия с API используйте любой tRPC-клиент, например, `@trpc/client`.

## Сборка и запуск в Docker

### 1. Создание Dockerfile

Для контейнеризации приложения создайте `Dockerfile` в корне проекта:

```Dockerfile
# Этап 1: Установка зависимостей
FROM oven/bun:1 as deps
WORKDIR /usr/src/app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Этап 2: Сборка приложения
FROM oven/bun:1 as build
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN bun run build

# Этап 3: Запуск в production
FROM oven/bun:1-slim as release
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY package.json .

EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080

# Запускаем собранный JS-файл
CMD ["bun", "run", "dist/index.js"]
```

### 2. Сборка образа

Выполните команду для сборки Docker-образа:

```bash
docker build -t trip-scheduler-api .
```

### 3. Запуск контейнера

Запустите собранный образ в контейнере. Не забудьте, что контейнер с PostgreSQL (`trip-scheduler-db`) уже должен быть запущен.

```bash
docker run -d \
  --name trip-scheduler-api \
  -p 8080:8080 \
  --network=host \
  trip-scheduler-api:latest
```

> **--network=host** используется для простого доступа к `localhost:5432`, где работает база данных. В реальном production окружении лучше использовать Docker-сети.
