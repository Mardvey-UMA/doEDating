import asyncio
import logging
from confluent_kafka import Consumer

KAFKA_BROKER = 'kafka:9092'
INPUT_TOPIC = 'check-photo-face'
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
consumer_conf = {
    'bootstrap.servers': KAFKA_BROKER,
    'group.id': 'face-detection-service',
    'auto.offset.reset': 'earliest'
}

class KafkaConsumerService:
    def __init__(self):
        self.consumer = Consumer(consumer_conf)
        self.consumer.subscribe([INPUT_TOPIC], on_assign=self.on_assign)

    def on_assign(self, consumer, partitions):
        logger.info(f"Подключение к Kafka успешно. Подписка на топики: {[p.topic for p in partitions]}")

    async def consume(self, handle_message):
        while True:
            msg = self.consumer.poll(1.0)
            if msg is None:
                await asyncio.sleep(0.1)
                continue
            if msg.error():
                logger.error(f"Ошибка в сообщении Kafka: {msg.error()}")
                continue
                
            logger.info(f"Получено сообщение из топика '{msg.topic()}', раздел '{msg.partition()}', offset '{msg.offset()}'")
            await handle_message(msg.value())

    def close(self):
        self.consumer.close()
        logger.info("Соединение с Kafka закрыто")
