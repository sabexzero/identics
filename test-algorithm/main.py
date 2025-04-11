from typing import List, Set
import numpy as np
import psycopg2
import psycopg2.extras
import spacy
import re

# Конфигурация базы данных
DATABASE_URL = {
    "dbname": "identics_db",
    "user": "identics",
    "password": "ckjyt[fk",
    "host": "193.108.115.65",
    "port": 5432,
}

# Загрузка модели spaCy
nlp = spacy.load('ru_core_news_lg')


def vectorize_paragraphs(paragraphs: List[str]) -> List[np.ndarray]:
    return [nlp(paragraph).vector for paragraph in paragraphs]


def create_ngrams(text: str, n: int = 10) -> Set[str]:
    text = re.sub(r'[^\w]', '', text.lower())
    return set(text[i:i + n] for i in range(len(text) - n + 1)) if len(text) >= n else set()


# Функция для вычисления процента совпадения n-грамм
def calculate_ngram_overlap(source_ngrams: Set[str], target_ngrams: Set[str]) -> float:
    if not source_ngrams:
        return 0.0
    intersection = source_ngrams & target_ngrams
    return len(intersection) / len(source_ngrams)


class AdvancedPlagiarismChecker:
    async def check_plagiarism(self, content_id):
        conn = None
        try:
            conn = psycopg2.connect(**DATABASE_URL)
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
                # Извлечение текстового контента
                get_content_query = """
                    SELECT text
                    FROM "check_content"
                    WHERE id = %s
                """
                cursor.execute(get_content_query, (content_id,))
                content_row = cursor.fetchone()
                if not content_row:
                    raise Exception("Content not found")
                content = content_row["text"]

                if not content:
                    raise Exception("Content is empty")

                # Разбиение на абзацы
                paragraphs = [p.strip() for p in content.split("\n") if p.strip()]
                if not paragraphs:
                    raise Exception("No paragraphs found")

                # Векторизация абзацев
                paragraph_vectors = vectorize_paragraphs(paragraphs)

                # Проверка на плагиат
                plagiarism_results = []
                total_content_length = len(content.split())

                for i, (paragraph, vector) in enumerate(zip(paragraphs, paragraph_vectors)):
                    # Поиск похожих векторов
                    query = """
                        SELECT text, vector, reference
                        FROM "paragraphs"
                        WHERE vector::vector <-> %s::vector > 0.4
                    """
                    cursor.execute(query, (vector.tolist(),))
                    result = cursor.fetchall()

                    # Создание n-грамм для текущего абзаца
                    paragraph_ngrams = create_ngrams(paragraph, n=10)

                    direct_matches = []
                    for row in result:
                        db_text = row["text"]
                        db_ngrams = create_ngrams(db_text, n=10)

                        # Расчет совпадения n-грамм
                        overlap = calculate_ngram_overlap(paragraph_ngrams, db_ngrams)

                        if overlap > 0.65:  # Порог для прямого плагиата
                            direct_matches.append({
                                "text": db_text,
                                "reference": row["reference"],
                                "similarity": overlap
                            })

                    if direct_matches:
                        best_match = max(direct_matches, key=lambda x: x["similarity"])
                        plagiarized_length = len(best_match["text"].split())
                        plagiarism_percent = best_match["similarity"] * 100
                        total_plagiarism_percent = (plagiarized_length / total_content_length) * 100

                        plagiarism_results.append({
                            "paragraph_index": i,
                            "plagiarism_percent": plagiarism_percent,
                            "total_plagiarism_percent": total_plagiarism_percent,
                            "best_match": best_match
                        })

                # Итоговое значение плагиата
                overall_plagiarism = sum(item["total_plagiarism_percent"] for item in plagiarism_results)
                return {"overall_plagiarism": overall_plagiarism, "details": plagiarism_results}

        except Exception as e:
            raise Exception(f"Database query error: {e}")
        finally:
            if conn:
                conn.close()