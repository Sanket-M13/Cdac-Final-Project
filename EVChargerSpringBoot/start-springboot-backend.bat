@echo off
echo Starting EV Charger Spring Boot API...
echo.

cd /d "%~dp0"

echo Checking if Maven is installed...
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Maven is not installed or not in PATH. Please install Maven first.
    pause
    exit /b 1
)

echo.
echo Building the application...
call mvn clean compile

if %errorlevel% neq 0 (
    echo Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo.
echo Starting the Spring Boot application...
echo The API will be available at: http://localhost:5000
echo Swagger UI will be available at: http://localhost:5000/swagger-ui.html
echo.

call mvn spring-boot:run

pause