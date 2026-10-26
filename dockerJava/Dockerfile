FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
#RUN mvn dependency:go-offline //ancienne version du --mount=type=cache
COPY src ./src

RUN --mount=type=cache,target=/root/.m2 mvn clean package

FROM scratch
COPY --from=build /app/target/api.war /api.war


