FROM python:3.9

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл зависимостей
COPY requirements.txt /app/requirements.txt

# Обновляем pip, setuptools и wheel, и устанавливаем зависимости
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt

# Устанавливаем системные библиотеки
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

# Копируем весь проект
COPY . /app

# Указываем команду для запуска бота
CMD ["python", "teleBot.py"]
