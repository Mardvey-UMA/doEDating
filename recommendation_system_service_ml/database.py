# file: database.py
from dataclasses import dataclass
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from geopy.distance import geodesic

@dataclass
class User:
    user_id: int
    first_name: str
    last_name: str
    about_me: str
    selected_interests: List[int]
    photos: List[str]
    gender: str
    city: str
    job: str
    education: str
    age: int
async def get_info_current_user(session: AsyncSession, user_id: int):
    query = text("""
    SELECT about_me
    FROM users
    WHERE users.id = :user_id
    """)
    interests_query = text("""
    SELECT interest_id FROM user_interests WHERE user_id = :user_id
    """)
    
    interests_result = await session.execute(interests_query, {"user_id": user_id})
    interests = [row[0] for row in interests_result.fetchall()]  # fetchall нужно для извлечения всех строк

    # Получаем информацию о пользователе
    result = await session.execute(query, {"user_id": user_id})
    about_me = result.fetchone()  # Используем fetchone для получения первой строки данных

    return (about_me[0], interests)  # Возвращаем результат


async def get_user_filters(session: AsyncSession, user_id: int):
    query = text("""
    SELECT min_age, max_age, gender_filter, search_radius, latitude, longitude
    FROM user_filters
    JOIN user_coordinates ON user_filters.user_id = user_coordinates.user_id
    WHERE user_filters.user_id = :user_id
    """)
    result = await session.execute(query, {"user_id": user_id})
    filters = result.fetchone()
    if not filters:
        raise ValueError(f"Filters not found for user_id {user_id}")
    return filters


async def find_matching_users(session: AsyncSession, filters):
    min_age, max_age, gender_filter, search_radius, latitude, longitude = filters
    query = text("""
    SELECT 
      *
    FROM users u
    WHERE u.age BETWEEN :min_age AND :max_age
      AND u.gender = :gender_filter
    """)
    result = await session.execute(query, {"min_age": min_age, "max_age": max_age, "gender_filter": gender_filter})
    users = result.fetchall()

    matching_users = []
    for user in users:
        user_coords_query = text("""
        SELECT latitude, longitude FROM user_coordinates WHERE user_id = :user_id
        """)
        user_coords = await session.execute(user_coords_query, {"user_id": user.id})
        user_coords = user_coords.fetchone()

        if not user_coords:
            continue

        distance = geodesic((latitude, longitude), (user_coords.latitude, user_coords.longitude)).km
        if distance <= search_radius:
            interests_query = text("""
            SELECT interest_id FROM user_interests WHERE user_id = :user_id
            """)
            interests = await session.execute(interests_query, {"user_id": user.id})
            interests = [row[0] for row in interests.fetchall()]
            
            photos_query = text("""
            SELECT path FROM photos WHERE user_id = :user_id
            """)
            photos = await session.execute(photos_query, {"user_id": user.id})
            photos = [row[0] for row in photos.fetchall()]

            matching_users.append(User( #делаем это все List[User]
                user_id=user.id,
                about_me=user.about_me,
                first_name=user.first_name,
                last_name=user.last_name,
                selected_interests=interests,
                photos=photos,
                gender=user.gender,
                city=user.city,
                job=user.job,
                education=user.education,
                age=user.age
            ))

    return matching_users
