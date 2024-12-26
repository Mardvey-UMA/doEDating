import asyncio
import json
import logging
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
from os import getenv
from aiogram import Bot, Dispatcher, html, Router, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, KeyboardButton, ReplyKeyboardMarkup, InlineKeyboardMarkup, InlineKeyboardButton
from apscheduler.schedulers.asyncio import AsyncIOScheduler

KAFKA_BROKER = 'kafka:9092'
INPUT_TOPIC = 'user-notifications'
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TOKEN = "8139260626:AAEFB1ZobUmmNEX3TB3o_67cKpat6d1PXv0"
BASE_URL = getenv('BASE_URL')
dp = Dispatcher()
consumer = None
scheduler = AsyncIOScheduler(timezone='Europe/Moscow')
start_router = Router()
bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))


# Создание Kafka продюсера внутри асинхронной функции
async def create_producer():
    producer = AIOKafkaProducer(
        bootstrap_servers=KAFKA_BROKER,
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    await producer.start()  # Стартуем продюсера
    return producer


@start_router.message(F.text == "Включить уведомления")
async def notifications_on(message: Message):
    # Получаем данные пользователя
    telegram_id = "@" + message.from_user.username
    chat_id = message.chat.id

    # Создаем Kafka продюсера
    producer = await create_producer()

    # Отправляем данные в Kafka
    await kaf_send_credentials(producer, telegram_id, chat_id)

    # Запускаем потребление сообщений из Kafka
    asyncio.create_task(consume_kaf_messages())

    await message.answer(f'Уведомления включены', reply_markup=main_kb())


async def kaf_send_credentials(producer, telegram_id, chat_id):
    message = {
        'telegram_id': telegram_id,
        'chat_id': chat_id
    }
    await producer.send_and_wait('tgCredentials', value=message)
    logger.info(f"Sent credentials to Kafka: {message}")

def kb_notifications_on():
    kb_list = [
        [KeyboardButton(text="Включить уведомления")]
    ]
    return ReplyKeyboardMarkup(keyboard=kb_list, resize_keyboard=True)


def main_kb():
    kb_list = [
        [KeyboardButton(text="О боте")],
        [KeyboardButton(text="Перейти на сайт")],
        [KeyboardButton(text="Выключить уведомления")],
        [KeyboardButton(text="Мой chat_id")]
    ]
    keyboard = ReplyKeyboardMarkup(
        keyboard=kb_list,
        resize_keyboard=True,
        input_field_placeholder="Воспользуйтесь меню:"
    )
    return keyboard


def site_link_kb():
    kb = [
        [InlineKeyboardButton(text="Наш сайт", url="https://www.wildberries.ru/")]
    ]
    return InlineKeyboardMarkup(inline_keyboard=kb)


@start_router.message(F.text == "Мой chat_id")
async def send_chat_id(message: Message):
    await message.answer(f"Ваш chat_id: {message.chat.id}")


@start_router.message(CommandStart())
async def command_start_handler(message: Message):
    await message.answer(f'Привет, {message.from_user.full_name}\n'
                         f'Этот бот будет присылать тебе уведомления о новых '
                         f'лайках и мэтчах с сайта PATROLMATCH.com\n'
                         f'Если хочешь начать получать уведомления прямо сейчас, нажми на кнопку ниже',
                         reply_markup=kb_notifications_on())


@start_router.message(F.text == "Перейти на сайт")
async def get_inl_between_link(message: Message):
    await message.answer("Скорей переходи на сайт!", reply_markup=site_link_kb())


@start_router.message(F.text == "О боте")
async def command_info(message: Message):
    await message.answer(f'Это бот PATROLMATCH\n'
                         f'Он будет уведомлять тебя о новых мэтчах и лайках с сайта PATROLMATCH.com')


@start_router.message(F.text == "Выключить уведомления")
async def notifications_off(message: Message):
    await kaf_stop()
    await message.answer(f'Уведомления выключены', reply_markup=kb_notifications_on())


@start_router.message(F.text == "Включить уведомления")
async def notifications_on(message: Message):
    # !!!
    asyncio.create_task(consume_kaf_messages())
    await message.answer(f'Уведомления включены', reply_markup=main_kb())


async def kaf_stop():
    global consumer
    if consumer:
        await consumer.stop()
        consumer = None
        logger.info("Kafka consumer stopped successfully.")
    else:
        logger.warning("Kafka consumer is not running.")


async def consume_kaf_messages():
    global consumer
    if consumer is not None:
        logger.warning("Kafka consumer is already running")
        return
    consumer = AIOKafkaConsumer(
        INPUT_TOPIC,
        bootstrap_servers=KAFKA_BROKER,
        group_id='notification-tg-bot',
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )
    await consumer.start()
    logger.info("Kafka consumer started.")
    try:
        async for msg in consumer:
            message_data = msg.value
            if message_data.get("type") == "like":
                await send_like_notification(message_data)
            elif message_data.get("type") == "match":
                await send_match_notification(message_data)

    except Exception as e:
        logger.error(f"Error in Kafka consumer: {e}")
    finally:
        await consumer.stop()
        consumer = None
        logger.info("Kafka consumer stopped.")


async def send_like_notification(data):
    chat_id = int(data["chat_id"])
    await bot.send_message(chat_id, "Новый лайк!")


async def send_match_notification(data):
    chat_id = int(data["chat_id"])
    telegram_id = data["telegram_id"]
    message = f"Поздравляем, у вас новый мэтч! Telegram ID: {telegram_id}"
    await bot.send_message(chat_id=chat_id, text=message)


async def main():
    dp.include_router(start_router)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
