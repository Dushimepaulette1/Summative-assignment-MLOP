FROM python:3.10-slim

RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

COPY --chown=user requirements.txt .
RUN pip install --upgrade pip && pip install --default-timeout=200 --no-cache-dir -r requirements.txt

COPY --chown=user . .

WORKDIR /app/backend

# Hugging Face Spaces requires port 7860
CMD ["uvicorn", "prediction:app", "--host", "0.0.0.0", "--port", "7860"]
