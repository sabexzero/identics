import os
import random

from aiokafka.consumer import consumer
from aiokafka.producer import producer
from fastapi import FastAPI
from pydantic import BaseModel
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
import asyncio


# Сообщение, получаемое из топика "check-request-topic"
class CheckRequestMessage(BaseModel):
    checkId: str
    needAiCheck: bool
    needPlagiarismCheck: bool
    requestsInOrder: int
    text: str


# Сообщение, отправляемое в топик "check-complete-topic"
class CheckCompleteMessage(BaseModel):
    checkId: str
    plagiarismCheckResult: int
    aiCheckResult: int


app = FastAPI()

# Настройки Kafka
KAFKA_IP = os.getenv('KAFKA_IMAGE_NAME')
KAFKA_PORT = os.getenv('KAFKA_PORT')
CHECK_REQUEST_TOPIC = 'check-request-topic'
CHECK_COMPLETE_TOPIC = 'check-complete-topic'


# Функция обработки сообщения
async def process_check_request(consumer: AIOKafkaConsumer, producer: AIOKafkaProducer):
    async for msg in consumer:
        # Парсим сообщение
        check_request = CheckRequestMessage.parse_raw(msg.value)

        # Генерируем результаты проверок
        ai_check_result = random.randint(1, 100) if check_request.needAiCheck else 0
        plagiarism_check_result = random.randint(1, 100) if check_request.needPlagiarismCheck else 0

        # Создаем сообщение с результатами
        check_complete_message = CheckCompleteMessage(
            checkId=check_request.checkId,
            plagiarismCheckResult=plagiarism_check_result,
            aiCheckResult=ai_check_result
        )

        # Отправляем результат в "check-complete-topic"
        await producer.send_and_wait(CHECK_COMPLETE_TOPIC, check_complete_message.json().encode('utf-8'))


# Фоновая задача для прослушивания сообщений Kafka
@app.on_event("startup")
async def startup_event():
    loop = asyncio.get_event_loop()

    consumer = AIOKafkaConsumer(
        CHECK_REQUEST_TOPIC,
        loop=loop,
        bootstrap_servers=KAFKA_IP + ":" + KAFKA_PORT,
        group_id="check_request_group"
    )
    producer = AIOKafkaProducer(
        loop=loop,
        bootstrap_servers=KAFKA_IP + ":" + KAFKA_PORT
    )

    await consumer.start()
    await producer.start()

    asyncio.create_task(process_check_request(consumer, producer))


@app.on_event("shutdown")
async def shutdown_event():
    await consumer.stop()
    await producer.stop()


# Запуск приложения
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)