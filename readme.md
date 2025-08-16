Обновленный `README.md` для корневого каталога проекта:

# 📅 Trip Scheduler: Планировщик Путешествий

**Trip Scheduler** — это комплексное решение для создания идеальных маршрутов путешествий. Это кросс-платформенное приложение, состоящее из десктопного клиента на базе Tauri и веб-версии, с акцентом на офлайн-работу и последующую синхронизацию данных с сервером.


[![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2-24C8E2?logo=tauri)](https://tauri.app/)
[![Hono](https://img.shields.io/badge/Hono-E36002?logo=hono)](https://hono.dev/)
[![tRPC](https://img.shields.io/badge/tRPC-2B81C8?logo=trpc)](https://trpc.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite)](https://www.sqlite.org/)
[![Rust](https://img.shields.io/badge/Rust-black?logo=rust)](https://www.rust-lang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)

![250812_02h26m13s_screenshot](assets/250812_02h26m13s_screenshot.png)


## 🌟 Ключевые возможности

-   **🗺️ Детальное планирование:** Создавайте поездки, разбивайте их по дням и добавляйте активности с привязкой ко времени.
-   **✍️ Богатый контент:** Используйте встроенный Markdown-редактор (`Milkdown`) для заметок, добавляйте галереи изображений и отмечайте места на интерактивной карте (`OpenLayers`).
-   **✈️ Кросс-платформенность:** Работайте с приложением на десктопе (Linux) через Tauri или в любом современном веб-браузере (PWA).
-   **📡 Офлайн-режим:** Десктопная версия работает с локальной базой данных SQLite, а веб-версия использует Service Worker для кэширования, что обеспечивает полную функциональность без доступа к сети.
-   **🔄 Синхронизация данных:** Логика для синхронизации локальных изменений с удаленным сервером, что позволяет иметь доступ к актуальным планам с разных устройств.
-   **✨ Современный интерфейс:** Интуитивно понятный и адаптивный интерфейс с возможностью перетаскивания (drag-and-drop) активностей.
-   **🛠️ Гибкая архитектура:** Фронтенд построен на принципах Feature-Sliced Design, а бэкенд предоставляет типобезопасный API благодаря tRPC.

## 🏗️ Архитектура проекта

Проект организован как монорепозиторий, управляемый с помощью `Bun Workspaces`.

-   **`apps/client` (Клиентское приложение)**
    -   **Фреймворк:** Vue 3 (Composition API), Vite.
    -   **Десктопная версия:** Собрана с помощью Tauri, что обеспечивает нативную интеграцию с ОС и прямой доступ к файловой системе.
    -   **Локальная БД:** SQLite (`tauri-plugin-sql`) для офлайн-работы в десктопном приложении.
    -   **Управление состоянием:** Pinia для централизованного и реактивного управления состоянием.
    -   **API-клиент:** Динамически переключается между tRPC (для веба), прямым доступом к SQL (для Tauri) и мок-данными (для автономной разработки).

-   **`apps/server` (Серверная часть)**
    -   **Среда выполнения и фреймворк:** Bun и Hono для создания высокопроизводительного API.
    -   **API:** tRPC для построения типобезопасного API и REST для загрузки файлов.
    -   **База данных:** PostgreSQL с Drizzle ORM для работы с данными.

## 🚀 Технологический стек

-   **Фронтенд:** Vue 3, Vite, TypeScript, Pinia, Vue Router, Sass (SCSS), OpenLayers, Milkdown.
-   **Бэкенд:** Hono, tRPC, Drizzle ORM, TypeScript.
-   **Десктоп:** Tauri, Rust.
-   **База данных:** PostgreSQL (сервер), SQLite (десктопный клиент).
-   **Среда выполнения и инструменты:** Bun, Docker, ESLint.

## 🛠️ Установка и запуск

### Предварительные требования

-   [Bun](https://bun.sh/) (v1.1.0 или выше).
-   [Rust и его toolchain](https://www.rust-lang.org/tools/install).
-   [Docker](https://www.docker.com/get-started/) и Docker Compose.
-   [Системные зависимости для Tauri](https://tauri.app/v1/guides/getting-started/prerequisites).

### Пошаговая инструкция

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/xsolare/trip-scheduler
    cd trip-scheduler
    ```

2.  **Установите зависимости во всем проекте:**
    ```bash
    bun install
    ```

3.  **Настройте и запустите бэкенд:**

    a. **Запустите контейнер с PostgreSQL:**
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

    b. **Создайте файл окружения** в `apps/server/.env` и добавьте в него:
    ```env
    DATABASE_URL="postgresql://trip-scheduler:trip-scheduler@localhost:5432/trip_scheduler_dev"
    API_URL="http://localhost:8080"
    ```

    c. **Примените миграции и наполните БД сервера:**
    ```bash
    bun --cwd ./apps/server run db:migrate
    bun --cwd ./apps/server run db:seed
    ```

4.  **Наполните локальную базу данных клиента (для Tauri):**
    ```bash
    bun --cwd ./apps/client run db:seed
    ```

### Запуск в режиме разработки

Откройте два терминала для одновременного запуска сервера и клиента.

1.  **Запустите сервер:**
    ```bash
    bun --cwd ./apps/server dev
    ```
    Сервер tRPC будет доступен по адресу `http://localhost:8080`.

2.  **Запустите клиент (Tauri или Веб):**

    *   Для **десктопного приложения Tauri**:
        ```bash
        bun --cwd ./apps/client tauri:dev
        ```
    *   Для **веб-версии**:
        ```bash
        bun --cwd ./apps/client dev:web
        ```

## 📜 Доступные скрипты

| Команда                                 | Описание                                                                   |
| :-------------------------------------- | :------------------------------------------------------------------------- |
| **Разработка**                          |
| `bun --cwd ./apps/server dev`           | Запуск сервера API в режиме разработки.                                    |
| `bun --cwd ./apps/client dev:web`       | Запуск веб-клиента в режиме разработки.                                    |
| `bun --cwd ./apps/client tauri:dev`     | Запуск десктопного приложения Tauri в режиме разработки.                   |
| **Сборка**                              |
| `bun --cwd ./apps/server build`         | Сборка production-версии сервера.                                          |
| `bun --cwd ./apps/client build:web`     | Сборка веб-клиента для production.                                         |
| `bun --cwd ./apps/client tauri:build`   | Сборка исполняемого файла десктопного приложения.                          |
| **База данных**                         |
| `bun --cwd ./apps/server db:migrate`    | Применение миграций к БД сервера (PostgreSQL).                             |
| `bun --cwd ./apps/server db:generate`   | Генерация новых миграций для сервера на основе схемы Drizzle.              |
| `bun --cwd ./apps/server db:seed`       | Наполнение БД сервера тестовыми данными.                                   |
| `bun --cwd ./apps/client db:seed`       | Наполнение локальной БД клиента (SQLite) тестовыми данными.                |
| `bun --cwd ./apps/client db:reset`      | Удаление локальной БД клиента (SQLite).                                    |
| **Линтинг и типизация**                 |
| `bun run lint`                          | Проверка кода всего проекта с помощью ESLint.                              |
| `bun run typecheck`                     | Проверка типов TypeScript во всем проекте.                                 |

## 📜 Пример приложения

![250812_02h26m58s_screenshot](assets/250812_02h26m58s_screenshot.png)
