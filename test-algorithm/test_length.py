# import os
#
# import boto3
# from botocore.config import Config
# def get_s3_folder_size(bucket_name, folder_path, aws_access_key_id, aws_secret_access_key):
#     my_config = Config(
#         region_name='ru1',
#         signature_version='v4',
#         retries={
#             'max_attempts': 10,
#             'mode': 'standard'
#         }
#     )
#
#     session = boto3.Session(
#         aws_access_key_id=aws_access_key_id,
#         aws_secret_access_key=aws_secret_access_key
#     )
#
#     s3 = session.client('s3', config=my_config, endpoint_url='https://s3.timeweb.cloud')
#     total_size = 0
#
#     kwargs = {'Bucket': bucket_name, 'Prefix': folder_path}
#     while True:
#         print("HUEPA")
#         response = s3.list_objects_v2(**kwargs)
#         print("JOPA")
#         if 'Contents' in response:
#             for obj in response['Contents']:
#                 total_size += obj['Size']
#         if not response.get('IsTruncated'):
#             break
#         kwargs['ContinuationToken'] = response['NextContinuationToken']
#
#     return total_size
#
# def upload_to_s3_fixed(bucket, local_path, s3_path, access_key, secret_key):
#     """Функция с исправлениями для Timeweb Cloud"""
#     config = Config(
#         region_name='ru-1',  # Обязательно с дефисом!
#         signature_version='s3v4',  # Критично для Timeweb
#         s3={'addressing_style': 'virtual'}
#     )
#
#     session = boto3.Session(
#         aws_access_key_id=access_key,
#         aws_secret_access_key=secret_key
#     )
#
#     s3 = session.client(
#         's3',
#         endpoint_url='https://s3.timeweb.cloud',
#         config=config
#     )
#
#     try:
#         # Для бинарных файлов (TS-сегменты, изображения и т.д.)
#         extra_args = {
#             'ACL': 'private',
#             'ContentType': 'application/octet-stream',  # Важно для бинарных файлов!
#             'Metadata': {'uploaded-via': 'python-script'}
#         }
#
#         s3.upload_file(
#             Filename=local_path,
#             Bucket=bucket,
#             Key=s3_path,
#             ExtraArgs=extra_args
#         )
#         print(f"✅ Успешно: {local_path} -> s3://{bucket}/{s3_path}")
#     except Exception as e:
#         print(f"❌ Ошибка: {str(e)}")
#         raise
#
#
# def upload_folder_to_s3(bucket_name, folder_path, s3_destination_path,
#                         aws_access_key_id, aws_secret_access_key):
#     """
#     Рекурсивно загружает папку в S3-хранилище Timeweb Cloud.
#
#     :param bucket_name: Имя бакета (например, 'my-bucket')
#     :param folder_path: Локальный путь к папке (например, '/home/user/data')
#     :param s3_destination_path: Путь в S3 (например, 'backups/2023')
#     :param aws_access_key_id: Ключ доступа S3
#     :param aws_secret_access_key: Секретный ключ S3
#     """
#     # Настройка подключения к Timeweb Cloud
#     my_config = Config(
#         region_name='ru1',
#         retries={'max_attempts': 3, 'mode': 'standard'},
#         signature_version='s3v4'
#     )
#
#     session = boto3.Session(
#         aws_access_key_id=aws_access_key_id,
#         aws_secret_access_key=aws_secret_access_key
#     )
#
#     s3 = session.client('s3',
#                         config=my_config,
#                         endpoint_url='https://s3.twcstorage.ru')
#
#     # Нормализация путей
#     folder_path = os.path.normpath(folder_path)
#     if not s3_destination_path.endswith('/'):
#         s3_destination_path += '/'
#
#     # Рекурсивная загрузка файлов
#     for root, dirs, files in os.walk(folder_path):
#         for file in files:
#             local_path = os.path.join(root, file)
#
#             # Относительный путь внутри папки
#             relative_path = os.path.relpath(local_path, folder_path)
#             s3_path = os.path.join(s3_destination_path, relative_path).replace('\\', '/')
#
#             try:
#                 s3.upload_file(
#                     Filename=local_path,
#                     Bucket=bucket_name,
#                     Key=s3_path
#                 )
#                 print(f"Uploaded: {local_path} -> s3://{bucket_name}/{s3_path}")
#             except Exception as e:
#                 print(f"Error uploading {local_path}: {str(e)}")
#
#     print("Upload completed!")
#
#
# bucket_name = '8c259ec8-f46f0995-78e0-4d91-9553-aab777018472'
# #folder_path = '/home/vkuksa/hls_87efb0b3-cfef-4c6d-82cb-3d7cfd7316921765785653180218545.tmp'
# folder_path = '/home/vkuksa/hls_test/1.txt'
# s3_path = 'interviews/test-interview-id/hls/1.txt'
# aws_access_key_id = 'O6XI80BQJJ08H0JG5QA9'
# aws_secret_access_key = 'TN5CR4bnmb2Gbcnw66GEl6VaxMLaniHsYl7YzSVW'
#
# upload_to_s3_fixed(bucket_name, folder_path, s3_path, aws_access_key_id, aws_secret_access_key)
# size_in_bytes = get_s3_folder_size(bucket_name, s3_path, aws_access_key_id, aws_secret_access_key)
# print(f"Folder size: {size_in_bytes} bytes")

import boto3
from botocore.config import Config

def upload_file_to_s3():
    # Конфигурация для Timeweb Cloud
    config = Config(
        region_name='ru-1',
        request_checksum_calculation="when_required",
        response_checksum_validation="when_required"
    )

    # Инициализация клиента
    s3 = boto3.client(
        's3',
        endpoint_url='https://s3.twcstorage.ru',
        aws_access_key_id='O6XI80BQJJ08H0JG5QA9',  # Замените на свои
        aws_secret_access_key='TN5CR4bnmb2Gbcnw66GEl6VaxMLaniHsYl7YzSVW',  # Замените на свои
        config=config
    )

    try:
        # Загрузка файла
        s3.upload_file(
            Filename='/home/vkuksa/hls_87efb0b3-cfef-4c6d-82cb-3d7cfd7316921765785653180218545.tmp/segment0033.ts',
            Bucket='8c259ec8-f46f0995-78e0-4d91-9553-aab777018472',
            Key='interviews/test-interview-id/hls-test/segment0033.ts',
            ExtraArgs={
                'ACL': 'public-read'
            }
        )
        print("Файл успешно загружен!")
    except Exception as e:
        print(f"Ошибка загрузки: {e}")
        raise

upload_file_to_s3()