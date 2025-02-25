import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import psycopg2
import psycopg2.extras
import spacy
import numpy as np

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

# Функция для векторизации текста с использованием spaCy
def vectorize_paragraphs(paragraphs: List[str]) -> List[np.ndarray]:
    return [nlp(paragraph).vector for paragraph in paragraphs]

# Функция для поиска самой длинной совпадающей последовательности слов (LCS)
def find_longest_common_sequence(paragraph_words, db_text_words):
    max_length = 0
    current_length = 0
    i, j = 0, 0

    while i < len(paragraph_words) and j < len(db_text_words):
        if paragraph_words[i] == db_text_words[j]:
            current_length += 1
            max_length = max(max_length, current_length)
            i += 1
            j += 1
        else:
            current_length = 0
            if i > j:
                j += 1
            else:
                i += 1

    return max_length


@app.post("/check-plagiarism/")
async def check_plagiarism(data: InputData):
    # Извлечение текстового контента
    content = data.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Content is empty")

    # Разбиение на абзацы
    paragraphs = [p.strip() for p in content.split("\n") if p.strip()]
    if not paragraphs:
        raise HTTPException(status_code=400, detail="No paragraphs found")

    # Векторизация абзацев
    paragraph_vectors = vectorize_paragraphs(paragraphs)

    # Проверка на плагиат
    plagiarism_results = []
    total_content_length = len(content.split())

    try:
        conn = psycopg2.connect(**DATABASE_URL)
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            for i, (paragraph, vector) in enumerate(zip(paragraphs, paragraph_vectors)):
                # SQL-запрос с использованием оператора расстояния <-> (требуется расширение pgvector)
                query = """
                SELECT text, vector, reference
                FROM "Paragraphs"
                WHERE vector::vector <-> %s::vector < 0.2
                """
                cursor.execute(query, (vector.tolist(),))
                result = cursor.fetchall()

                # Поиск совпадений с помощью линейного алгоритма
                direct_matches = []
                paragraph_words = paragraph.lower().split()

                for row in result:
                    db_text = row["text"]

                    # Преобразуем текст из базы данных в слова
                    db_text_words = db_text.lower().split()

                    # Найти максимальную длину совпадающей последовательности слов
                    longest_match_length = find_longest_common_sequence(paragraph_words, db_text_words)

                    if longest_match_length > 5:
                        direct_matches.append({
                            "text": db_text,
                            "reference": row["reference"],
                            "match_length": longest_match_length
                        })

                if direct_matches:
                    # Вычисление процента плагиата
                    best_match = max(direct_matches, key=lambda x: x["match_length"])
                    plagiarized_length = best_match["match_length"]
                    plagiarism_percent = plagiarized_length / len(paragraph_words) * 100
                    total_plagiarism_percent = plagiarized_length / total_content_length * 100

                    plagiarism_results.append({
                        "paragraph_index": i,
                        "plagiarism_percent": plagiarism_percent,
                        "total_plagiarism_percent": total_plagiarism_percent,
                        "best_match": best_match
                    })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
    finally:
        if conn:
            conn.close()

    # Итоговое значение плагиата
    overall_plagiarism = sum(item["total_plagiarism_percent"] for item in plagiarism_results)
    return {"overall_plagiarism": overall_plagiarism, "details": plagiarism_results}

# Точка входа
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
