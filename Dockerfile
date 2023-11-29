FROM maven:3-eclipse-temurin-17 as mvn
ARG GITHUB_TOKEN
ENV TOKEN=$GITHUB_TOKEN
COPY src/ /tmp/src
COPY pom.xml /tmp/pom.xml
COPY frontend/ /tmp/frontend
RUN cat /tmp/frontend/.npmrc
WORKDIR /tmp/
RUN --mount=type=cache,target=/root/.m2,source=/.m2,from=ghcr.io/scc-digitalhub/custom-resource-manager:cache \ 
    --mount=type=cache,target=/tmp/frontend/node_modules,source=/node_modules,from=ghcr.io/scc-digitalhub/custom-resource-manager:cache \ 
    --mount=type=cache,target=/tmp/frontend/yarn.lock,source=/yarn.lock,from=ghcr.io/scc-digitalhub/custom-resource-manager:cache \
    mvn package -DskipTests

FROM gcr.io/distroless/java17-debian12:nonroot
LABEL org.opencontainers.image.source=https://github.com/scc-digitalhub/custom-resource-manager
COPY --chown=65532:65532 --from=mvn /tmp/target/resourcemanager-1.0.0-SNAPSHOT.jar /home/nonroot/resourcemanager-1.0.0-SNAPSHOT.jar
EXPOSE 8080
CMD ["/home/nonroot/resourcemanager-1.0.0-SNAPSHOT.jar"]
