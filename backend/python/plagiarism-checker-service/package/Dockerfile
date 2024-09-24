FROM python:3.9-slim

WORKDIR /app

COPY backend/python/plagiarism-checker-service/package/requirements.txt /app/requirements.txt

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "main.py"]
