# small Java 21 runtime
FROM eclipse-temurin:21-jre-alpine

# safer runtime (non-root), optional but recommended
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

# CI produces this exact file
COPY backend/target/taskraum.jar ./taskraum.jar

EXPOSE 8080
# let Render tweak memory without rebuilding
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

USER app
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar taskraum.jar"]