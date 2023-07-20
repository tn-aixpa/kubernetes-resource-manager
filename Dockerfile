FROM maven:3-eclipse-temurin-17 as mvn
ARG GITHUB_TOKEN
ENV TOKEN=$GITHUB_TOKEN
COPY src/ /tmp/src
COPY pom.xml /tmp/pom.xml
COPY frontend/ /tmp/frontend
RUN cat /tmp/frontend/.npmrc
WORKDIR /tmp/
RUN  mvn package -DskipTests

FROM gcr.io/distroless/java17-debian11:nonroot
COPY --chown=65532:65532 --from=mvn /tmp/target/resourcemanager-1.0.0-SNAPSHOT.jar /home/nonroot/resourcemanager-1.0.0-SNAPSHOT.jar
EXPOSE 8080
CMD ["/home/nonroot/resourcemanager-1.0.0-SNAPSHOT.jar"]
