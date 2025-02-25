import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import psycopg2
from psycopg2.extras import execute_values
import spacy
import numpy as np
import json

# Настройка приложения FastAPI
app = FastAPI()

# Конфигурация базы данных
DATABASE_URL = {
    "dbname": "identics_db",
    "user": "identics",
    "password": "identics",
    "host": "localhost",
    "port": 5438,
}

# Загрузка модели spaCy
nlp = spacy.load('ru_core_news_lg')

# Модель данных для JSON-запроса
class InputData(BaseModel):
    content: str
    reference: str

# Функция для векторизации текста
def vectorize_text(text: str) -> np.ndarray:
    return nlp(text).vector

@app.post("/store-paragraphs")
async def store_paragraphs(data: InputData):
    # Проверка входных данных
    content = data.content.strip()
    reference = data.reference.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Content is empty")
    if not reference:
        raise HTTPException(status_code=400, detail="Reference is empty")

    # Разбиение текста на абзацы
    paragraphs = [p.strip() for p in content.split("\n") if p.strip()]
    if not paragraphs:
        raise HTTPException(status_code=400, detail="No paragraphs found")

    # Подготовка данных для вставки в базу
    to_insert = []
    for paragraph in paragraphs:
        vector = vectorize_text(paragraph).tolist()
        to_insert.append((paragraph, vector, reference))  # Используем JSON для вектора

    # Сохранение в базу данных
    try:
        conn = psycopg2.connect(**DATABASE_URL)
        with conn:
            with conn.cursor() as cursor:
                execute_values(
                    cursor,
                    """
                    INSERT INTO "Paragraphs" (text, vector, reference)
                    VALUES %s
                    """,
                    to_insert,
                )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database insert error: {e}")
    finally:
        if conn:
            conn.close()

    return {"message": "Paragraphs stored successfully", "paragraphs_count": len(paragraphs)}

# Точка входа
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8021)
