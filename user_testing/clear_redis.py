import asyncio
import redis.asyncio as redis

async def clear_redis_data(redis_host='localhost', redis_port=6379, db=0):
    # Подключение к Redis
    client = redis.StrictRedis(host=redis_host, port=redis_port, db=db)

    # Очищаем текущую базу данных
    await client.flushdb()
    print("Все данные из текущей базы данных очищены!")

    # Или можно использовать flushall для очистки всех баз данных:
    # await client.flushall()
    # print("Все данные во всех базах данных очищены!")

async def main():
    await clear_redis_data()

if __name__ == "__main__":
    asyncio.run(main())
