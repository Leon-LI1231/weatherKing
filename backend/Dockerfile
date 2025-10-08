# Use Gradle image with JDK 21
FROM gradle:jdk21

WORKDIR /app

# Copy project files
COPY build.gradle .
COPY settings.gradle .
COPY src ./src

# Expose port
EXPOSE 8080

# Run the application
CMD ["gradle", "bootRun"]
