FROM gradle:8.10-jdk17 as builder

# Установка пользовательского каталога для кэша Gradle
ENV GRADLE_USER_HOME=/opt/gradle/caches

WORKDIR /opt/app

# Копирование файлов Gradle и зависимостей
COPY build.gradle gradlew settings.gradle ./
COPY gradle gradle/

# Скачивание зависимостей
RUN ./gradlew dependencies

# Копирование остальной части приложения
COPY . .

# Сборка приложения без тестов
RUN ./gradlew clean build -x test

FROM eclipse-temurin:17-jre-jammy

WORKDIR /opt/app

# Копирование собранного JAR файла
COPY --from=builder /opt/app/build/libs/*.jar /opt/app/app.jar

ENTRYPOINT ["java", "-jar", "/opt/app/app.jar"]