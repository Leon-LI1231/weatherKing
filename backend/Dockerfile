# Use Gradle image with JDK 21
FROM gradle:jdk21

WORKDIR /app

# Copy Gradle Wrapper files first (assuming they are in your backend directory)
# This is crucial for running the build
COPY gradlew .
COPY gradle ./gradle

# Copy Gradle build files
COPY build.gradle .
COPY settings.gradle .

# Copy source code
COPY src ./src

# Explicitly run the build task. This downloads all dependencies, 
# compiles the main code, and compiles/runs tests.
# This step resolves all "package does not exist" errors.
RUN ./gradlew assemble

# Expose port
EXPOSE 8080

# Run the application. Since 'build' already ran tests, 'gradle bootRun' is sufficient.
# We run 'bootRun' to start the application server.
CMD ["sh", "-c", "gradle bootRun"]