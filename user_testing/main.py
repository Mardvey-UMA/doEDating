import requests
import random
from faker import Faker
import os
from typing import List
from datetime import date, timedelta
from about_me import about_me_texts
import time

BASE_URL = "http://localhost:80"
REGISTER_URL = f"{BASE_URL}/api/auth/register"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
PATCH_USER_URL = f"{BASE_URL}/api/users"
UPLOAD_PHOTO_URL = f"{BASE_URL}/api/users/photo"

fake = Faker('ru_RU')

cities = ["Саратов", "Энгельс", "Балаково"]
genders = ["MALE", "FEMALE"]


def generate_birth_date() -> str:
    today = date.today()
    age = random.randint(20, 22)
    birth_date = today - timedelta(days=365 * age)
    return birth_date.strftime("%Y-%m-%d")


def generate_user_data(user_id: int, gender: str) -> dict:
    username = f"user{user_id}"
    email = fake.email()
    city = random.choice(cities)
    about_me = about_me_texts.pop(0)
    telegram_id = ''.join([str(random.randint(0, 9)) for _ in range(9)])

    if gender == "MALE":
        first_name = fake.first_name_male()
        last_name = fake.last_name_male()
    else:
        first_name = fake.first_name_female()
        last_name = fake.last_name_female()

    birth_date = generate_birth_date()

    return {
        "username": username,
        "password": username,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "birth_date": birth_date,
        "gender": gender,
        "city": city,
        "job": fake.job(),
        "education": fake.company(),
        "about_me": about_me,
        "chat_id": "5058608908",
        "telegram_id": str(telegram_id),
        "selected_interests": random.sample(range(1, 121), 5)
    }


def register_user(user_data: dict):
    response = requests.post(REGISTER_URL, json=user_data)
    return response.json()


def login_user(username: str, password: str) -> str:
    response = requests.post(LOGIN_URL, json={"username": username, "password": password})
    return response.json().get("access_token")


def update_user(user_id: int, access_token: str, user_data: dict):
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.patch(PATCH_USER_URL, json=user_data, headers=headers)
    return response.json()


def upload_user_photo(user_id: int, file_path: str, access_token: str, photo_id: int):
    headers = {"Authorization": f"Bearer {access_token}"}

    with open(file_path, "rb") as file:
        files = {"file": file}
        response = requests.post(UPLOAD_PHOTO_URL, headers=headers, files=files)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Ошибка: {response.status_code} - {response.text}")
        return None


def create_and_process_users(num_users: int):
    photo_index = 1

    for user_id in range(1, num_users + 1):
        print(f"Создание пользователя {user_id}...")

        # Определяем пол пользователя
        gender = "FEMALE" if user_id <= 50 else "MALE"

        user_data = generate_user_data(user_id, gender)

        register_response = register_user(user_data)
        print(f"Пользователь {user_id} зарегистрирован.")
        #time.sleep(1)
        token = login_user(user_data["username"], user_data["password"])
        #print(token)
        #time.sleep(1)
        update_user(user_id, token, user_data)
        print(f"Данные пользователя {user_id} обновлены.")

        idx = []
        for i in range(3):
            photo_path = f"./people_photos/user{photo_index}.jpg"
            if os.path.exists(photo_path):
                upload_user_photo(user_id, photo_path, token, photo_index)
                time.sleep(1)
                print(f"Фотография {photo_index} для пользователя {user_id} загружена.")
                idx.append(photo_index)
            else:
                print(f"Фотография {photo_index} для пользователя {user_id} не найдена.")
            photo_index += 1

        res = []
        for i in idx:
            res.append(f"/photos/{user_id}/{user_id}_user{i}.jpg")

        headers = {"Authorization": f"Bearer {token}"}
        user_data = {
            "photos": res
        }
        r = requests.patch(PATCH_USER_URL, headers=headers, json=user_data)
        print(r)
        time.sleep(1)

create_and_process_users(100)
