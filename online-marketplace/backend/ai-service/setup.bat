@echo off
echo Installing Python dependencies for AI Comment Summarization Service...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://www.python.org/
    pause
    exit /b 1
)

echo Python found. Installing dependencies...
pip install -r requirements.txt

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please make sure pip is installed and you have internet connection
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup completed successfully!
echo.
echo The first time you use the summarization feature,
echo it will download the AI model (this may take a few minutes).
echo ========================================
pause

