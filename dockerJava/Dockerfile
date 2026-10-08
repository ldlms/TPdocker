FROM eclipse-temurin:26.0.2.1_1-jdk-noble AS build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends maven && rm -rf /var/lib/apt/lists/*

COPY pom.xml .
#RUN mvn dependency:go-offline //ancienne version du --mount=type=cache
COPY src ./src

RUN --mount=type=cache,target=/root/.m2 mvn clean package

FROM scratch
COPY --from=build /app/target/api.war /api.war


