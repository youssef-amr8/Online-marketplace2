#!/bin/bash

echo "Installing Python dependencies for AI Comment Summarization Service..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

echo "Python found. Installing dependencies..."
pip3 install -r requirements.txt

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to install dependencies"
    echo "Please make sure pip is installed and you have internet connection"
    exit 1
fi

echo ""
echo "========================================"
echo "Setup completed successfully!"
echo ""
echo "The first time you use the summarization feature,"
echo "it will download the AI model (this may take a few minutes)."
echo "========================================"

