from time import sleep

import requests
import json

# Ваш токен авторизации
auth_token = "Bearer F2acWU7YRJePbomr3Hyh2AO1eiOG_Ih0VwfDZPIA"

# ID пользователя для второго запроса
user_id = "24846320"

# Идентификаторы заявок
application_ids = [
    "67fd3d176a88725af214d503",
    "67fd3cb36a88725af2129b51",
    "67fd3c816a88725af2118300",
    "67fd37c66a88725af2f7173a",
    "67fd35526a88725af2e93bbe",
    "67fd34656a88725af2e3e892",
    "67fd30976a88725af2cdda02",
    "67fd0b5f6a88725af2e7ad64",
    "67fd08bc6a88725af2d57884",
    "67fcf7ae6a88725af2561d81",
    "67fcf27b6a88725af22ced37",
    "67fcf2316a88725af22aab56",
    "67fcecbe6a88725af2ffaa7b",
    "67fceb986a88725af2f66d05",
    "67fce6206a88725af2c9507c",
    "67fce1fe6a88725af2a7f116",
    "67fcdf966a88725af294a114",
    "67fcd8226a88725af256f8f8",
    "67fcc94d6a88725af2df4f00",
    "67fcc29b6a88725af2a8db63",
    "67fcc1776a88725af29feac6",
    "67fcbdd16a88725af282c9d9",
    "67fcba906a88725af2688df6",
    "67fca4156a88725af2bdfce1",
    "67fc9d5b6a88725af293e7b7",
    "67fc3a086a88725af287e44a",
    "67fc341b6a88725af2771571",
    "67fc1c9b6a88725af23bbc96",
    "67fc1afb6a88725af235ff4f",
    "67fc1a0d6a88725af232b415",
    "67fc02be6a88725af2cdd5f9",
    "67fbfd186a88725af2b17064",
    "67fbf9306a88725af29d1abe",
    "67fbf17d6a88725af2749943",
    "67fbe46f6a88725af22d9251",
    "67fbe23c6a88725af22158e2",
    "67fbd3d66a88725af2d199e5",
    "67fbd0fb6a88725af2c29a06",
    "67fbc9996a88725af29b8c1c",
    "67fbc94f6a88725af29a0644",
    "67fbc04d6a88725af265fe4c",
    "67fbb6666a88725af22c36cd",
    "67fbaffb6a88725af206ffcd",
    "67fb9e756a88725af29cf71a",
    "67fb97de6a88725af2749776",
    "67fb96cf6a88725af26e06bc",
    "67fb96456a88725af26ab4b5",
    "67fb90146a88725af244ba56",
    "67fb8ce46a88725af2313712",
    "67fb87ef6a88725af212857a",
    "67fb7da36a88725af2d4373a",
    "67fb7a176a88725af2bfd35c",
    "67fb746f6a88725af29f4b35",
    "67fb70066a88725af2861b46",
    "67fb6f976a88725af283b68c",
    "67fb56ff6a88725af206ec87",
    "67fb50466a88725af2eaad0e",
    "67fb35956a88725af29bf736",
    "67fb137c6a88725af26952b9",
    "67fafa896a88725af2396c47",
    "67faeb2a6a88725af21325f0",
    "67fadb0d6a88725af2ec3b91",
    "67fad24d6a88725af2d6f389",
    "67fac9586a88725af2bbeba5",
    "67fac7dd6a88725af2b6d12b",
    "67fabeba6a88725af2951a9d",
    "67fabc766a88725af28c2a03",
    "67faae8e6a88725af250037e",
    "67fa98316a88725af2e29891",
    "67fa95c86a88725af2d6ad75",
    "67fa92ed6a88725af2c7f08b",
    "67fa77216a88725af23849a5",
    "67fa768c6a88725af2350a09",
    "67fa726b6a88725af21d9f6b",
    "67fa6dbc6a88725af2034b62",
    "67fa6b626a88725af2f63409",
    "67fa68196a88725af2e3a69c"
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
    response = requests.get(url, headers=headers, timeout=10)
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
        try:
            messages_response = get_chat_messages(chat_value)
        except Exception:
            continue
        sleep(1)

        # Выводим application_id слева от chat_value
        print(f"{application_id} | Chat ID: {chat_value}")
        print("---------------------------------")

        # Выводим сообщения чата
        if len(messages_response.get('messages', [])) < 6:
            for message in messages_response.get('messages', [])[::-1]:
                text = message.get('content', {}).get('text', 'No text')
                author = message.get('author_id', -1)
                textAuthor = "РАБОТОДАТЕЛЬ"
                if author == 0 or author == 1:
                    textAuthor = "ПИДОРАСЫ"
                elif author != user_id:
                    textAuthor = "ЧЕЛИК"
                print(f"  Message: {textAuthor} {text}")

        print()  # Пустая строка между чатами
