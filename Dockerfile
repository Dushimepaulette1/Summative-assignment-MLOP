FROM python:3.10-slim

WORKDIR /app

RUN pip install --upgrade pip

COPY requirements.txt .
RUN pip install --default-timeout=200 --no-cache-dir -r requirements.txt

COPY . .

WORKDIR /app/backend

CMD ["uvicorn", "prediction:app", "--host", "0.0.0.0", "--port", "8000"]
