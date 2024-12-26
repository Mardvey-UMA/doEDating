# file: app.py
import asyncio
from dataclasses import dataclass
from typing import List
from confluent_kafka import Consumer, Producer
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from zmq.backend import first

from database import get_user_filters, find_matching_users, get_info_current_user
from geopy.distance import geodesic
from calculate_rec import compare_user_with_group
import json
import logging
#from dotenv import load_dotenv
import os
from typing import Any
import aioredis


async def test_redis_connection():
    try:
        redis = await aioredis.from_url('redis://localhost:6379')

        test_key = 'test_key'
        test_value = 'test_value'

        await redis.set(test_key, test_value)

        result = await redis.get(test_key)
        result = result.decode('utf-8') if result else None

        if result == test_value:
            logger.info("Redis connection test passed: Value matched!")
        else:
            logger.warning("Redis connection test failed: Value mismatch.")

        await redis.close()

    except Exception as e:
        logger.error(f"Error testing Redis connection: {e}")

#load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# DATABASE_URL = os.getenv("DATABASE_URL")
# KAFKA_BROKER = os.getenv("KAFKA_BROKER")
# START_TOPIC = os.getenv("START_TOPIC")
# RESPONSE_TOPIC = os.getenv("RESPONSE_TOPIC")
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/users_db"
KAFKA_BROKER = "localhost:29092"
START_TOPIC = "start-calculate-recommendation"
RESPONSE_TOPIC = "recommendation-response"
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

@dataclass
class User:
    user_id: int
    about_me: str
    first_name: str
    last_name: str
    selected_interests: List[int]
    photos: List[str]
    gender: str
    city: str
    job: str
    education: str
    age: int

producer = Producer({'bootstrap.servers': KAFKA_BROKER})


async def handle_message(message: dict):
    try:
        user_id, status = message.get("user_id"), message.get("status")
        if status != "start":
            return
        logger.info(f"Received message from Kafka: {message}")

        redis_key_in_progress = f"user:{user_id}:processing"

        redis = await aioredis.from_url(
            'redis://localhost:6379'
        )


        if await redis.exists(redis_key_in_progress):
            logger.warning(f"Calculations already in progress for user {user_id}.")
            #logger.info(f"Calculations already in progress for user {user_id}. Skipping.")
            #await redis.close()
            #return

        await redis.set(redis_key_in_progress, "processing")

        await redis.close()
        async with async_session() as session:
            filters = await get_user_filters(session, user_id)
            if not filters:
                logger.warning(f"Filters not found for user_id {user_id}")
                return

            users = await find_matching_users(session, filters)

        about_me_current, interests_current = await get_info_current_user(session, user_id)
        if not about_me_current:
            logger.warning(f"User info not found for user_id {user_id}")
            return

        current_user = User(
            user_id=user_id,
            about_me=about_me_current,
            selected_interests=interests_current,
            first_name = "mode",
            last_name = "moke",
            photos=[],
            gender="",
            city="",
            job="",
            education="",
            age=0
        )

        batch_size = 10
        user_batches = [users[i:i + batch_size] for i in range(0, len(users), batch_size)]

        for batch_index, user_batch in enumerate(user_batches, 1):
            matching_users_with_scores = compare_user_with_group(current_user, user_batch)
            users_list = [
                {
                    "id": user.user_id,
                    "about_me": user.about_me,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "selected_interests": user.selected_interests,
                    "photos": user.photos,
                    "gender": user.gender,
                    "city": user.city,
                    "job": user.job,
                    "education": user.education,
                    "age": user.age,
                }
                for user in matching_users_with_scores
            ]

            redis_key = f"recommendation_results:{user_id}:{batch_index}"
            await save_to_redis(redis_key, users_list)

            response = {
                "user_id": user_id,
                "batch_index": batch_index,
                "users_list": users_list
            }
            producer.produce(RESPONSE_TOPIC, value=json.dumps(response).encode('utf-8'))
            producer.flush()

        final_response = {
            "user_id": user_id,
            "status": "completed"
        }
        final_response_kafka = {
            "user_id": user_id,
            "batch_index": -1,
            "users_list": []
        }
        producer.produce(RESPONSE_TOPIC, value=json.dumps(final_response_kafka).encode('utf-8'))
        producer.flush()
        final_response_kafka = {
            "user_id": user_id,
            "batch_index": 0,
            "users_list": []
        }
        producer.produce(RESPONSE_TOPIC, value=json.dumps(final_response_kafka).encode('utf-8'))
        producer.flush()
        await save_to_redis(f"recommendation_results:{user_id}:final", final_response)
        redis = await aioredis.from_url(
            'redis://localhost:6379'
        )
        await redis.delete(redis_key_in_progress)

        await redis.close()
    except Exception as e:
        logger.error(f"Error handling message: {e}")


async def save_to_redis(key: str, value: Any):

    redis = await aioredis.from_url(
        'redis://localhost:6379'
    )
    await redis.set(key, json.dumps(value, ensure_ascii=False))

    await redis.close()

async def consume():
    consumer = Consumer({
        'bootstrap.servers': KAFKA_BROKER,
        'group.id': 'recommendation-service',
        'auto.offset.reset': 'earliest',
    })

    consumer.subscribe([START_TOPIC])

    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print(f"Consumer error: {msg.error()}")
            continue

        message = eval(msg.value().decode('utf-8'))
        await handle_message(message)


async def main():
    await test_redis_connection()
    await consume()

if __name__ == "__main__":
    asyncio.run(main())
