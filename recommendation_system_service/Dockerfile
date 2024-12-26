# Используем официальный Python-образ
FROM python:3.10-slim

# Установка дополнительных библиотек для PostgreSQL и Kafka
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл зависимостей
COPY requirements.txt ./requirements.txt

# Устанавливаем Python-зависимости с кэшированием pip
RUN --mount=type=cache,target=/root/.cache/pip pip install --no-cache-dir -r requirements.txt

# Копируем папку приложения
COPY . /app

# Устанавливаем переменную окружения для предотвращения буферизации вывода
ENV PYTHONUNBUFFERED=1

# Команда запуска
CMD ["python", "app.py"]
