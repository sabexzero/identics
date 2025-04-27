#!/bin/bash

# Переменные
DOCKER_HUB_USERNAME="sabextech"
DOCKER_HUB_REPOSITORY="identics-monolith-java"
DOCKER_HUB_TAG="latest"
DOCKERFILE_PATH="package/Dockerfile"
REMOTE_USER="root"
REMOTE_HOST="193.108.115.65"
CONTAINER_NAME="identics-backend"
IMAGE_NAME="$DOCKER_HUB_USERNAME/$DOCKER_HUB_REPOSITORY:$DOCKER_HUB_TAG"

# Переменные окружения Keycloak (можно задать здесь или передать при запуске скрипта)
KEYCLOAK_HOST=${KEYCLOAK_HOST:-"keycloak.example.com"}
KEYCLOAK_REALM=${KEYCLOAK_REALM:-"master"}
KEYCLOAK_INITIALIZER_INITIALIZE_ON_STARTUP=${KEYCLOAK_INITIALIZER_INITIALIZE_ON_STARTUP:-"false"}
KEYCLOAK_MASTER_REALM_NAME=${KEYCLOAK_MASTER_REALM_NAME:-"master"}
KEYCLOAK_APPLICATION_REALM_NAME=${KEYCLOAK_APPLICATION_REALM_NAME:-"identics"}
KEYCLOAK_ADMIN_CLIENT_ID=${KEYCLOAK_ADMIN_CLIENT_ID:-"admin-cli"}
KEYCLOAK_CLIENT_ID=${KEYCLOAK_CLIENT_ID:-"identics-backend"}
KEYCLOAK_ADMIN_USERNAME=${KEYCLOAK_ADMIN_USERNAME:-"admin"}
KEYCLOAK_ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD:-"admin"}
KEYCLOAK_CLIENT_SECRET=${KEYCLOAK_CLIENT_SECRET:-""}

# Сборка Docker-образа
echo "Building Docker image..."
docker build -t $IMAGE_NAME -f $DOCKERFILE_PATH .

# Пуш образа в Docker Hub
echo "Pushing Docker image to Docker Hub... $IMAGE_NAME"
docker push $IMAGE_NAME

# Подключение к удаленной машине по SSH
echo "Connecting to remote machine via SSH..."
ssh -i ~/.ssh/identics $REMOTE_USER@$REMOTE_HOST << EOF
    docker pull $IMAGE_NAME
    # Остановка и удаление старого контейнера
    echo "Stopping and removing old container..."
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true

    # Запуск нового контейнера с переменными окружения
    echo "Running new container..."
    docker run -d \
        -p 9091:9091 \
        --name $CONTAINER_NAME \
        -e "spring.security.oauth2.resourceserver.jwt.issuer-uri=https://${KEYCLOAK_HOST}/realms/${KEYCLOAK_REALM}" \
        -e "keycloak-initializer.initializeOnStartup=${KEYCLOAK_INITIALIZER_INITIALIZE_ON_STARTUP}" \
        -e "keycloak-initializer.masterRealm=${KEYCLOAK_MASTER_REALM_NAME}" \
        -e "keycloak-initializer.applicationRealm=${KEYCLOAK_APPLICATION_REALM_NAME}" \
        -e "keycloak-initializer.admin-client-id=${KEYCLOAK_ADMIN_CLIENT_ID}" \
        -e "keycloak-initializer.client-id=${KEYCLOAK_CLIENT_ID}" \
        -e "keycloak-initializer.username=${KEYCLOAK_ADMIN_USERNAME}" \
        -e "keycloak-initializer.password=${KEYCLOAK_ADMIN_PASSWORD}" \
        -e "keycloak-initializer.client-secret=${KEYCLOAK_CLIENT_SECRET}" \
        -e "keycloak-initializer.realm=${KEYCLOAK_REALM}" \
        -e "keycloak-initializer.client-url=https://${KEYCLOAK_HOST}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/" \
        -e "keycloak-initializer.admin-url=https://${KEYCLOAK_HOST}/auth" \
        $IMAGE_NAME

    echo "Container started successfully!"
EOF

echo "Deployment completed!"