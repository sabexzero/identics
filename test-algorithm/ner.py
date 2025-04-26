import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, ClientError

# --- ВАШИ ДАННЫЕ ---
endpoint_url = 'storage.yandexcloud.net'
bucket_name = 'contrast'
access_key = 'YCAJEgQhJOnOHyIDhBeGxAFQV' # Ваш Key ID
secret_key = 'YCP91Kjtzp9zU8CaXmBp_fOPb0F-XGyhgkU5EYAT' # Ваш Secret Key
# Обычно регион для Yandex Cloud - ru-central1
region_name = 'ru-central1'

# --- ПРЕДУПРЕЖДЕНИЕ О БЕЗОПАСНОСТИ ---
# Никогда не храните ключи доступа прямо в коде в продакшн-среде!
# Используйте переменные окружения, файлы конфигурации (~/.aws/credentials или ~/.boto),
# или сервисы управления секретами.
# Этот пример упрощен для демонстрации.

def list_root_files(endpoint, bucket, key_id, secret, region):
    """
    Подключается к S3-совместимому хранилищу Yandex Cloud и выводит список файлов
    в корневом каталоге бакета.
    """
    print(f"Попытка подключения к эндпоинту: {endpoint}")
    print(f"Используемый бакет: {bucket}")

    try:
        # Создаем сессию boto3
        # Важно указать endpoint_url для Yandex Object Storage
        session = boto3.session.Session()

        # Создаем S3 клиент
        s3_client = session.client(
            service_name='s3',
            endpoint_url=f'https://{endpoint}', # Убедимся что протокол https
            aws_access_key_id=key_id,
            aws_secret_access_key=secret,
            region_name=region # Указание региона может быть важным
        )

        print("Клиент S3 успешно создан.")
        print(f"\nПолучение списка файлов из корня бакета '{bucket}'...")

        # Получаем список объектов в корне бакета
        # Используем Delimiter='/', чтобы отделить файлы в корне от "папок"
        # Объекты в корне будут в 'Contents', а "папки" - в 'CommonPrefixes'
        response = s3_client.list_objects_v2(Bucket=bucket, Delimiter='/')

        print(f"\n--- Файлы в корневом каталоге бакета '{bucket}' ---")

        found_files = False
        if 'Contents' in response:
            for obj in response.get('Contents', []):
                 # Объект с ключом, заканчивающимся на '/', обычно представляет собой "папку",
                 # созданную некоторыми инструментами S3. Пропускаем их.
                 # Также пропускаем объекты с нулевым размером, если они заканчиваются на '/'
                 # (хотя Delimiter='/' должен их отфильтровать в CommonPrefixes).
                if not obj['Key'].endswith('/') or obj['Size'] > 0:
                    print(f"- {obj['Key']} (Размер: {obj['Size']} байт)")
                    found_files = True

        if not found_files:
            print("В корневом каталоге файлы не найдены.")
            # Дополнительно проверим, есть ли там "папки"
            if 'CommonPrefixes' in response and response['CommonPrefixes']:
                 print("(Найдены папки/префиксы в корне)")
            #     for prefix in response.get('CommonPrefixes', []):
            #         print(f"  - Папка: {prefix['Prefix']}")


    except NoCredentialsError:
        print("Ошибка: Не удалось найти учетные данные.")
        print("Убедитесь, что ключи доступа предоставлены корректно.")
    except PartialCredentialsError:
        print("Ошибка: Предоставлены неполные учетные данные.")
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code')
        if error_code == 'InvalidAccessKeyId':
            print(f"Ошибка аутентификации: Неверный ID ключа доступа. Проверьте правильность ключа.")
        elif error_code == 'SignatureDoesNotMatch':
            print(f"Ошибка аутентификации: Неверный секретный ключ. Проверьте правильность ключа.")
        elif error_code == 'NoSuchBucket':
            print(f"Ошибка: Бакет '{bucket}' не найден.")
        elif error_code == 'AccessDenied':
             print(f"Ошибка: Доступ к бакету '{bucket}' запрещен. Проверьте права ключа.")
        else:
            # Выводим полный текст ошибки для диагностики
            print(f"Произошла ошибка клиента S3 ({error_code}): {e}")
    except Exception as e:
        print(f"Произошла непредвиденная ошибка: {e}")

# --- Запуск функции ---
if __name__ == "__main__":
    list_root_files(endpoint_url, bucket_name, access_key, secret_key, region_name)