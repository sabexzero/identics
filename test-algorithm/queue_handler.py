import asyncio

import redis
import time
import json  # Импортируем модуль json для работы с JSON

import requests

from main import AdvancedPlagiarismChecker

# Подключение к Redis
redis_client = redis.StrictRedis(host='193.108.115.65', port=6379, password="myredispassword123190", decode_responses=True)

# Название очереди
QUEUE_NAME = 'checkQueue'

plag_checker = AdvancedPlagiarismChecker()


# Функция для обработки задачи
async def process_task(task_json):
    try:
        # Десериализация JSON-строки в словарь Python
        task_data = json.loads(task_json)

        # Разбор полей из JSON-объекта
        check_id = task_data.get('checkId')
        content_id = task_data.get('contentId')

        if not content_id:
            raise ValueError("Content ID is missing in the task data")

        # Выполнение проверки плагиата
        plagiarism_result = await plag_checker.check_plagiarism(content_id)

        # URL вебхука для отправки результатов
        webhook_url = "http://localhost:9091/checks/webhook/" + str(check_id)

        # Отправка POST-запроса с результатами
        response = requests.post(webhook_url, json=plagiarism_result)

        # Проверка статуса ответа
        if response.status_code == 200:
            print(f"Task with checkId {check_id} completed and results sent successfully")
        else:
            print(f"Failed to send results for task with checkId {check_id}. Status code: {response.status_code}, Response: {response.text}")

    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON: {e}")
    except Exception as e:
        print(f"An error occurred while processing the task: {e}")


# Основной цикл обработки очереди
async def process_queue():
    while True:
        task = redis_client.rpop(QUEUE_NAME)
        if task:
            await process_task(task)
        else:
            print("Queue is empty. Waiting for new tasks...")
            time.sleep(1)  # Ждём, если очередь пуста


if __name__ == "__main__":
    print("Starting task processor...")
    try:
        asyncio.run(process_queue())
    except KeyboardInterrupt:
        print("Task processor stopped.")