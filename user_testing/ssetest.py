import requests

BASE_URL = "http://localhost:80"

url = f"{BASE_URL}/api/recommendation/stream"

url2 = f"{BASE_URL}/api/recommendation"

LOGIN_URL = f"{BASE_URL}/api/auth/login"

def login_user(username: str, password: str) -> str:
    response = requests.post(LOGIN_URL, json={"username": username, "password": password})
    return response.json().get("access_token")

token = login_user("user3", "user3")

headers = {"Authorization": f"Bearer {token}"}

r = requests.post(url2, headers=headers)
print(r)

with requests.get(url, headers=headers, stream=True) as response:
    if response.status_code == 200:
        print("Подключено к SSE потоку. Ожидание данных...")
        # Читаем и выводим сообщения из потока
        for line in response.iter_lines():
            if line:
                # Преобразуем байты в строку и выводим
                message = line.decode('utf-8')
                print("Получено сообщение:", message)
    else:
        print(f"Ошибка при подключении к SSE потоку. Статус: {response.status_code}")
