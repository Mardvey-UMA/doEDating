import asyncio
import base64
import json
import logging
from kafka_consumer import KafkaConsumerService
from kafka_producer import KafkaProducerService
from face_detector import FaceDetectorService
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
consumer_service = KafkaConsumerService()
producer_service = KafkaProducerService()
detector_service = FaceDetectorService()
async def handle_message(message):
    try:
        message_data = json.loads(message.decode('utf-8'))
        if 'photo_id' not in message_data or 'image_data' not in message_data:
            raise ValueError("Недостаточно данных в сообщении: 'user_id' и 'image_data' обязательны")
        user_id = message_data['photo_id'].split("_")[0]
        photo_name = message_data['photo_id']
        try:
            image_data = base64.b64decode(message_data['image_data'])
        except base64.binascii.Error:
            raise ValueError("Ошибка при декодировании Base64 изображения")
        has_face = await detector_service.detect_face(image_data)
        response_data = {
            "user_id": user_id,
            "analyse_result": has_face,
            "photo_id": photo_name
        }
        if has_face:
            saved_path = await detector_service.save_photo(image_data, user_id, photo_name)
            response_data["photo_url"] = saved_path
        await producer_service.send(response_data)
        logger.info(f"Результат анализа отправлен: {response_data}")
    except Exception as e:
        logger.error(f"Ошибка при обработке сообщения: {e}")
async def main():
    try:
        await consumer_service.consume(handle_message)
    finally:
        consumer_service.close()
if __name__ == "__main__":
    asyncio.run(main())
