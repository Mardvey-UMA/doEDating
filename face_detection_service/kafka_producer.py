from confluent_kafka import Producer
import json
import logging
KAFKA_BROKER = 'kafka:9092'
OUTPUT_TOPIC = 'face-check-response'

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

producer_conf = {
    'bootstrap.servers': KAFKA_BROKER
}

class KafkaProducerService:
    def __init__(self):
        self.producer = Producer(producer_conf)
        logger.info("Kafka Producer успешно инициализирован")

    async def send(self, message):
        self.producer.produce(OUTPUT_TOPIC, value=json.dumps(message).encode('utf-8'))
        self.producer.flush()
        logger.info(f"Сообщение отправлено в Kafka в топик '{OUTPUT_TOPIC}': {message}")