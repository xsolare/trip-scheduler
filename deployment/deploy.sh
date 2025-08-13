#!/bin/bash

cd "$(dirname "$0")" || exit

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ENV_FILE=".env"
ENV_EXAMPLE_FILE=".env.example"

# --- Шаг 0: Проверка конфигурации ---
echo -e "\n${YELLOW}--- Шаг 0: Проверка файла конфигурации ---${NC}"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Файл $ENV_FILE не найден.${NC}"
    if [ -f "$ENV_EXAMPLE_FILE" ]; then
        echo -e "Копирую $ENV_EXAMPLE_FILE в $ENV_FILE..."
        cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
        echo -e "${GREEN}Файл $ENV_FILE создан. Пожалуйста, проверьте и заполните его, затем запустите скрипт снова.${NC}"
        exit 1 # Выходим, чтобы пользователь мог заполнить файл
    else
        echo -e "${RED}Критическая ошибка: Файл-пример $ENV_EXAMPLE_FILE не найден!${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}Конфигурация в порядке.${NC}"


# --- Шаг 1: Остановка и удаление предыдущего окружения ---
echo -e "\n${YELLOW}--- Шаг 1: Остановка и удаление предыдущего окружения ---${NC}"
docker compose down --remove-orphans --volumes

# --- Шаг 2: Сборка Docker-образов и запуск сервисов ---
echo -e "\n${YELLOW}--- Шаг 2: Сборка Docker-образов и запуск сервисов ---${NC}"
docker compose up --build -d
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при запуске docker compose. Развертывание прервано.${NC}"
    exit 1
fi

# --- Шаг 3: Применение миграций базы данных ---
echo -e "\n${YELLOW}--- Шаг 3: Применение миграций базы данных ---${NC}"
echo "Ожидание полной готовности сервера (10 секунд)..."
sleep 10

docker compose exec server bun --cwd ./apps/server run db:migrate
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка применения миграций. Проверьте логи контейнера 'server':${NC}"
    echo -e "${YELLOW}docker compose logs server${NC}"
    exit 1
fi
echo -e "${GREEN}Миграции успешно применены.${NC}"

echo -e "\n${GREEN}🎉 Развертывание успешно завершено!${NC}"
echo -e "Фронтенд доступен по адресу: ${GREEN}http://localhost${NC}"
echo -e "API сервера доступен по адресу: ${GREEN}http://localhost:8080${NC}"
echo -e "Для просмотра логов используйте: ${YELLOW}docker compose logs -f${NC}"
