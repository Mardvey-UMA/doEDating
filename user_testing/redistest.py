import asyncio
import redis.asyncio as redis
import json


async def get_all_redis_data(redis_host='localhost', redis_port=6379, db=0):
    # Подключение к Redis
    client = redis.StrictRedis(host=redis_host, port=redis_port, db=db)

    # Инициализация пустого словаря для хранения всех данных
    all_data = {}

    # Получаем все ключи с помощью SCAN (более эффективный способ, чем KEYS)
    cursor = 0
    while True:
        cursor, keys = await client.scan(cursor, count=1000)  # Получаем несколько ключей за раз

        for key in keys:
            try:
                # Получаем значение для каждого ключа, если оно существует
                value = await client.get(key)

                # Если ключ - строка (по умолчанию get() возвращает строку)
                if value is not None:
                    key_str = key.decode()  # Декодируем ключ из байтов
                    value_str = value.decode()  # Декодируем значение из байтов
                    all_data[key_str] = value_str  # Сохраняем в словарь

                    # Выводим каждый ключ и его значение в новой строке
                    print(f"{key_str}, {value_str}")
                    print(len(value_str))
                    print(type(value_str))
                    # Записываем результат в файл
                    with open("redis_data.json", "a") as file:
                        json.dump({key_str: value_str}, file, ensure_ascii=False)
                        file.write("\n")  # Пишем новую строку после каждого ключа

            except redis.exceptions.RedisError as e:
                print(f"Ошибка при получении значения для ключа {key}: {e}")

        # Если курсор вернул 0, значит мы перебрали все ключи
        if cursor == 0:
            break

    return all_data


async def main():
    data = await get_all_redis_data()


if __name__ == "__main__":
    asyncio.run(main())
