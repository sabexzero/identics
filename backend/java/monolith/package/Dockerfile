FROM openjdk:18-jdk-slim

WORKDIR /app

COPY target/api.jar app.jar

# Установка Node.js и Puppeteer
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g puppeteer@latest

EXPOSE 9091

ENTRYPOINT ["java", "-jar", "app.jar"]