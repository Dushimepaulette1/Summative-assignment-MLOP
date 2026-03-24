# Use official Python image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Upgrade pip to the latest version to prevent bugs
RUN pip install --upgrade pip

# Copy the requirements and install them with a longer timeout
COPY requirements.txt .
RUN pip install --default-timeout=200 --no-cache-dir -r requirements.txt

# Copy all your project files into the container
COPY . .

# Change to the src directory where app.py lives
WORKDIR /app/src

# Command to run the FastAPI server
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]