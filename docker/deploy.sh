#!/bin/bash

# Цвета для логов
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Пути к файлам окружения
CLIENT_ENV_FILE="docker/client/.env"
SERVER_ENV_FILE="docker/server/.env"

# Функция для проверки и создания .env файлов
check_and_create_env() {
    local env_file=$1
    local example_file="${env_file}.example"

    if [ ! -f "$env_file" ]; then
        echo -e "${YELLOW}Файл $env_file не найден.${NC}"
        if [ -f "$example_file" ]; then
            echo -e "Копирую $example_file в $env_file..."
            cp "$example_file" "$env_file"
            echo -e "${GREEN}Файл $env_file создан. Пожалуйста, проверьте его содержимое.${NC}"
        else
            echo -e "${RED}Критическая ошибка: Файл-пример $example_file не найден!${NC}"
            exit 1
        fi
    fi
}

# Шаг 0: Проверка конфигурации
echo -e "${YELLOW}Шаг 0: Проверка файлов конфигурации...${NC}"
check_and_create_env $CLIENT_ENV_FILE
check_and_create_env $SERVER_ENV_FILE
echo -e "${GREEN}Конфигурация в порядке.${NC}"

# Шаг 1: Остановка и удаление старых контейнеров
echo -e "${YELLOW}Шаг 1: Остановка и удаление предыдущего окружения...${NC}"
docker-compose down --remove-orphans --volumes

# Шаг 2: Сборка образов и запуск сервисов
echo -e "${YELLOW}Шаг 2: Сборка Docker-образов и запуск сервисов...${NC}"
docker-compose up --build -d
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при запуске docker-compose. Развертывание прервано.${NC}"
    exit 1
fi

# Шаг 3: Применение миграций базы данных
echo -e "${YELLOW}Шаг 3: Применение миграций базы данных...${NC}"
echo "Ожидание полной готовности сервера (10 секунд)..."
sleep 10

docker-compose exec server bun --cwd ./apps/server run db:migrate
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка применения миграций. Проверьте логи контейнера 'server':${NC}"
    echo -e "${YELLOW}docker-compose logs server${NC}"
    exit 1
fi
echo -e "${GREEN}Миграции успешно применены.${NC}"

echo -e "\n${GREEN}🎉 Развертывание успешно завершено!${NC}"
echo -e "Фронтенд доступен по адресу: ${GREEN}http://localhost${NC}"
echo -e "API сервера доступен по адресу: ${GREEN}http://localhost:8080${NC}"
echo -e "Для просмотра логов используйте: ${YELLOW}docker-compose logs -f${NC}"
