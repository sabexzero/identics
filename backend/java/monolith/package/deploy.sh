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

    # Запуск нового контейнера
    echo "Running new container..."
    docker run -d \
        -p 9091:9091 \
        --name $CONTAINER_NAME \
        $IMAGE_NAME

    echo "Container started successfully!"
EOF

echo "Deployment completed!"