import requests
import json

# Ваш токен авторизации
auth_token = "Bearer xpZ-Wa6QQKmngjJIV0o4_giuMUeWerw_6RwGMAIJ"

# ID пользователя для второго запроса
user_id = "402174701"

# Идентификаторы заявок
application_ids = [
    "67dad9dd04efd262dbe22c85",
    "67dabdc204efd262db213f5d",
    "67da9d9104efd262db330572",
    "67da935804efd262dbe3e24e",
    "67d9d93c04efd262dbd0dfcc",
    "67d9c0c204efd262db6d372b",
    "67d8b75e04efd262db62dc17"
]


# Первый POST-запрос для получения контактов
def get_contacts():
    url = "https://api.avito.ru/job/v1/applications/get_by_ids"
    headers = {
        "Authorization": auth_token,
        "Content-Type": "application/json"
    }
    data = {
        "ids": application_ids
    }
    response = requests.post(url, headers=headers, data=json.dumps(data))
    return response.json()


# Второй GET-запрос для получения сообщений чата
def get_chat_messages(chat_id):
    url = f"https://api.avito.ru/messenger/v3/accounts/{user_id}/chats/{chat_id}/messages/"
    headers = {
        "Authorization": auth_token
    }
    response = requests.get(url, headers=headers)
    return response.json()


# Основной процесс
if __name__ == "__main__":
    # Получение контактов
    contacts_response = get_contacts()

    # Извлечение chat.value и application_id
    contacts_data = []
    for app in contacts_response.get('applies', []):
        chat_value = app['contacts']['chat']['value']
        application_id = app['id']  # Извлекаем application_id
        contacts_data.append((application_id, chat_value))

    print("Application ID | Chat ID")
    print("-" * 30)

    # Для каждого chat.value выполнить второй запрос
    for application_id, chat_value in contacts_data:
        messages_response = get_chat_messages(chat_value)

        # Выводим application_id слева от chat_value
        print(f"{application_id} | Chat ID: {chat_value}")
        print("---------------------------------")

        # Выводим сообщения чата
        for message in messages_response.get('messages', [])[::-1]:
            text = message.get('content', {}).get('text', 'No text')
            print(f"  Message: {text}")

        print()  # Пустая строка между чатами