# Используйте официальный образ Java как базовый
FROM openjdk:21

# Указание рабочей директории внутри контейнера
WORKDIR /app

# Копирование артефакта сборки (например, собранного jar файла) в контейнер
COPY ./build/libs/discovery-service-0.0.1-SNAPSHOT.jar discovery-service-0.0.1-SNAPSHOT.jar

# Команда для запуска вашего приложения с учетом переменных окружения из .env файла
CMD ["java", "-jar", "discovery-service-0.0.1-SNAPSHOT.jar"]