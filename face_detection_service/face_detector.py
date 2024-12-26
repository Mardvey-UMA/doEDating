import cv2
from ultralytics import YOLO
import numpy as np
import aiofiles
import os
from datetime import datetime
import base64

PHOTO_STORAGE_PATH = "/photo-storage/photos"
os.makedirs(PHOTO_STORAGE_PATH, exist_ok=True)

model = YOLO('yolov8n-face.pt')
model.to("cpu")

class FaceDetectorService:
    @staticmethod
    async def detect_face(image_data):
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        results = model(image)

        boxes = results[0].boxes if results else []

        return boxes.data.size(0) > 0

    @staticmethod
    async def save_photo(image_data, user_id, photo_name):
        user_dir = os.path.join(PHOTO_STORAGE_PATH, str(user_id))
        os.makedirs(user_dir, exist_ok=True)

        file_name = f"{photo_name}"
        file_path = os.path.join(user_dir, file_name)

        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(image_data)

        return f"/photos/{user_id}/{file_name}"

def test_photo_storage_connection():
    test_file_path = os.path.join(PHOTO_STORAGE_PATH, "test_connection.txt")
    try:
        with open(test_file_path, "w") as test_file:
            test_file.write("Testing connection to photo-storage.")

        if os.path.exists(test_file_path):
            print("Успешное подключение к photo-storage.")
        else:
            print("Не удалось создать файл в photo-storage.")

    finally:
        if os.path.exists(test_file_path):
            os.remove(test_file_path)

            
test_photo_storage_connection()