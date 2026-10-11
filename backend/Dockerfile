# Stage 1: Build the Spring Boot application
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copy Maven wrapper and project configuration
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Copy source code and build the JAR
COPY src/ src/
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre

WORKDIR /app

# Run as a non-root user
RUN useradd --system --create-home appuser

COPY --from=build /app/target/*.jar /app/app.jar

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
