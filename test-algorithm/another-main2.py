import requests
import json

# Ваш токен авторизации
auth_token = "Bearer qkBPaJk4QiC5wbe5BoOfrAtu3eP9DN7C2Wx-HtX7"

user_id = "402174701"


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
    # Для каждого chat.value выполнить второй запрос
    contacts_data = ['u2i-NKi0cUtex0seQl3GxpGFEA']
    for chat_value in contacts_data:
        messages_response = get_chat_messages(chat_value)

        # Выводим application_id слева от chat_value
        print(f"Chat ID: {chat_value}")
        print("---------------------------------")

        # Выводим сообщения чата
        for message in messages_response.get('messages', [])[::-1]:
            text = message.get('content', {}).get('text', 'No text')
            print(f"  Message: {text}")

        print()  # Пустая строка между чатами