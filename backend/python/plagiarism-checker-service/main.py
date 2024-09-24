import os
import random
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
from pydantic import BaseModel
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

# Настройки Kafka
KAFKA_IP = os.getenv('KAFKA_IMAGE_NAME')
KAFKA_PORT = os.getenv('KAFKA_PORT')

CHECK_REQUEST_TOPIC = 'check-request-topic'
CHECK_COMPLETE_TOPIC = 'check-complete-topic'

async def process_check_request(consumer: AIOKafkaConsumer, producer: AIOKafkaProducer):
    async for msg in consumer:
        check_request = CheckRequestMessage.parse_raw(msg.value)

        ai_check_result = random.randint(1, 100) if check_request.needAiCheck else 0
        plagiarism_check_result = random.randint(1, 100) if check_request.needPlagiarismCheck else 0

        check_complete_message = CheckCompleteMessage(
            checkId=check_request.checkId,
            plagiarismCheckResult=plagiarism_check_result,
            aiCheckResult=ai_check_result
        )   

        await producer.send_and_wait(CHECK_COMPLETE_TOPIC, check_complete_message.json().encode('utf-8'))

async def main():
    loop = asyncio.get_event_loop()

    consumer = AIOKafkaConsumer(
        CHECK_REQUEST_TOPIC,
        loop=loop,
        bootstrap_servers=f"{KAFKA_IP}:{KAFKA_PORT}",
        group_id="check_request_group"
    )
    producer = AIOKafkaProducer(
        loop=loop,
        bootstrap_servers=f"{KAFKA_IP}:{KAFKA_PORT}"
    )

    await consumer.start()
    await producer.start()

    try:
        await process_check_request(consumer, producer)
    finally:
        await consumer.stop()
        await producer.stop()

if __name__ == "__main__":
    asyncio.run(main())