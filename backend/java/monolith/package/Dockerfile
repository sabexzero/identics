FROM openjdk:18-jdk-slim

WORKDIR /app

COPY target/api.jar app.jar

EXPOSE 9091

ENTRYPOINT ["java", "-jar", "app.jar"]