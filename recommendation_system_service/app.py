# file: app.py
import asyncio
import logging
from confluent_kafka import Consumer, Producer
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from database import get_user_filters, find_matching_users
import json
from dotenv import load_dotenv
import os
load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


DATABASE_URL = os.getenv("DATABASE_URL")
KAFKA_BROKER = os.getenv("KAFKA_BROKER")
START_TOPIC = os.getenv("START_TOPIC")
RESPONSE_TOPIC = os.getenv("RESPONSE_TOPIC")

engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

producer = Producer({'bootstrap.servers': KAFKA_BROKER})

async def handle_message(message):
    try:
        logger.info(f"Received message from Kafka: {message}")
        user_id, status = message.get("user_id"), message.get("status")
        if status != "start":
            return
        
        async with async_session() as session:
            filters = await get_user_filters(session, user_id)
            if not filters:
                logger.warning(f"Filters not found for user_id {user_id}")
                return

            users = await find_matching_users(session, filters)

        response = {
            "user_id": user_id,
            "users_list": users
        }
        # Сериализация в JSON вместо str(response)
        producer.produce(RESPONSE_TOPIC, value=json.dumps(response).encode('utf-8'))
        producer.flush()
    except Exception as e:
        print(f"Error handling message: {e}")


async def consume():
    consumer = Consumer({
        'bootstrap.servers': KAFKA_BROKER,
        'group.id': 'recommendation-service',
        'auto.offset.reset': 'earliest',
    })

    consumer.subscribe([START_TOPIC])
    logger.info(f"Subscribed to Kafka topic: {START_TOPIC}")
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            logger.error(f"Consumer error: {msg.error()}")
            continue

        message = eval(msg.value().decode('utf-8'))
        await handle_message(message)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(consume())
