import requests
import os

# Вставьте ваш API ключ от Pexels
API_KEY = 'JmnmlQbdLR1pLCG4OnNrd4Tqh0gLfDy0p9YTfl6sK2I2KtV8yuGnTtnc'
# Базовый URL для поиска фотографий
BASE_URL = "https://api.pexels.com/v1/search?query={}&per_page=80&page={}"

# Устанавливаем заголовки с API ключом
headers = {
    "Authorization": API_KEY
}

# Папка для сохранения фотографий
save_folder = "people_photos"
os.makedirs(save_folder, exist_ok=True)

# Переменные для контроля
total_images_needed = 160  # Количество фотографий, которое нужно скачать
current_page = 1
total_images_downloaded = 0
gender_keywords = ["portrait woman close-up", "portrait man close-up"]  # Ключевые слова для поиска
keyword_index = 1  # Индекс для переключения между женскими и мужскими портретами
photo_counter = 161  # Счётчик для уникальных имен файлов

# Цикл для загрузки фотографий с нескольких страниц
while total_images_downloaded < total_images_needed:
    # Формируем URL для текущей страницы с нужным ключевым словом
    url = BASE_URL.format(gender_keywords[keyword_index], current_page)

    # Делаем запрос к API
    response = requests.get(url, headers=headers)

    # Проверка успешности запроса
    if response.status_code == 200:
        photos = response.json()['photos']

        # Скачиваем фотографии с текущей страницы
        for i, photo in enumerate(photos):
            if total_images_downloaded >= total_images_needed:
                break

            img_url = photo['src']['medium']  # Получаем ссылку на изображение среднего размера
            img_data = requests.get(img_url).content

            # Сохраняем изображение в нужном формате
            with open(f"{save_folder}/user{photo_counter}.jpg", 'wb') as f:
                f.write(img_data)

            total_images_downloaded += 1
            photo_counter += 1

        print(f"Загружено {total_images_downloaded} из {total_images_needed} фотографий.")

        # Переходим к следующей странице
        current_page += 1

        # Если собрали 150 женских портретов, переключаемся на мужские
        #if total_images_downloaded == 160:
            #keyword_index = 1

    else:
        print(f"Ошибка при запросе на страницу {current_page}: {response.status_code}")
        break

print(f"Фотографии успешно загружены в папку {save_folder}. Всего {total_images_downloaded} фотографий.")
