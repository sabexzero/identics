import io
import os
import re
import time
from io import BytesIO
from pathlib import Path  # Используем pathlib для работы с путями

import PyPDF2
import fitz
import requests
import spacy
from bs4 import BeautifulSoup

BASE_URL = "https://cyberleninka.ru"
BASE_URL_ARTICLES = "https://cyberleninka.ru/article/c"
DESTINATION_FOLDER = Path("/home/vkuksa/identics/test-algorithm/downloaded")  # Используем Path для кросс-платформенности
PAGE_SIZE = 20


def parse_pdf_with_pymupdf(pdf_data: io.BytesIO) -> str: # <--- Меняем тип аргумента
    """Извлекает текст из PDF (переданного как BytesIO) до раздела 'Литература', пытаясь пропустить формулы."""

    # Паттерны и эвристики остаются теми же
    literature_patterns = [
        re.compile(r'^\s*(\d+\.?\s*)?л\s*и\s*т\s*е\s*р\s*а\s*т\s*у\s*р\s*а\s*$', re.IGNORECASE | re.UNICODE),
        re.compile(r'^\s*(\d+\.?\s*)?с\s*п\s*и\s*с\s*о\s*к\s+л\s*и\s*т\s*е\s*р\s*а\s*т\s*у\s*р\s*ы\s*$', re.IGNORECASE | re.UNICODE),
        re.compile(r'^\s*(\d+\.?\s*)?б\s*и\s*б\s*л\s*и\s*о\s*г\s*р\s*а\s*ф\s*и\s*ч\s*е\s*с\s*к\s*и\s*й\s+с\s*п\s*и\s*с\s*о\s*к\s*$', re.IGNORECASE | re.UNICODE),
        re.compile(r'^\s*(\d+\.?\s*)?и\s*с\s*п\s*о\s*л\s*ь\s*з\s*о\s*в\s*а\s*н\s*н\s*(а\s*я|ы\s*е)\s+(л\s*и\s*т\s*е\s*р\s*а\s*т\s*у\s*р\s*а|и\s*с\s*т\s*о\s*ч\s*н\s*и\s*к\s*и)\s*$', re.IGNORECASE | re.UNICODE)
    ]
    image_pattern = re.compile(r'рис(унок|\.)?\s*\d+', re.IGNORECASE | re.UNICODE)
    formula_chars = r'[=+\-−×÷/\\∫∑∏√∞∈∉⊂⊃⊆⊇∀∃∂∇≠≤≥≈∝%\[\]\(\)\{\}]' # Добавь нужные символы

    extracted_text_lines = []
    stop_extraction = False

    try:
        # --- Изменение здесь ---
        # Считываем байты из объекта BytesIO
        pdf_bytes = pdf_data.read()
        # Открываем документ из байтов
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        # --- Конец изменения ---

        for page_num in range(len(doc)):
            if stop_extraction:
                break
            page = doc.load_page(page_num)
            page_text = page.get_text("text")

            for line in page_text.split('\n'):
                normalized_line_for_check = line.strip()

                # Проверка на раздел литературы
                normalized_for_literature = re.sub(r'\s+', '', normalized_line_for_check).lower()
                # Удаляем цифры и точки в начале перед сравнением
                test_str = re.sub(r'^\d+\.?\s*', '', normalized_for_literature)
                for pattern in literature_patterns:
                    if pattern.match(test_str):
                         print(f"Найден раздел литературы: {line.strip()}")
                         stop_extraction = True
                         break
                if stop_extraction:
                    break

                # Пропускаем строки с упоминанием рисунков
                if image_pattern.search(normalized_line_for_check):
                     print(f"Пропускаем строку с рисунком: {line.strip()}") # Можно раскомментировать для отладки
                     continue

                # --- Попытка пропустить формулу (Эвристика) ---
                math_symbol_count = len(re.findall(formula_chars, line))
                letter_count = len(re.findall(r'[a-zA-Zа-яА-Я]', line))
                digit_count = len(re.findall(r'\d', line))
                total_chars = len(line.replace(" ", "")) # Длина без пробелов

                is_likely_formula = False
                if total_chars > 0:
                    # Пример 1: Много мат. символов
                    if math_symbol_count >= 2 or (math_symbol_count > 0 and total_chars < 15) : # Порог подбирать!
                        is_likely_formula = True

                    # Пример 2: Мало букв, много цифр/символов (кроме коротких строк)
                    if not is_likely_formula and total_chars > 5 and letter_count < total_chars * 0.3 and (digit_count + math_symbol_count) > total_chars * 0.4:
                         is_likely_formula = True

                    # Пример 3: Строка содержит символ верхнего/нижнего индекса
                    if not is_likely_formula and re.search(r'[⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]', line):
                        is_likely_formula = True

                if is_likely_formula:
                    print(f"Пропускаем строку, похожую на формулу: {line.strip()}") # Можно раскомментировать для отладки
                    continue # Пропускаем эту строку

                # Если строка прошла все проверки, добавляем ее
                extracted_text_lines.append(line)

        doc.close() # Не забываем закрыть документ

    except Exception as e:
        # Можно добавить более специфичную обработку ошибок fitz, если нужно
        print(f"Ошибка при обработке PDF из BytesIO: {e}")
        return f"Error processing PDF from BytesIO: {e}"

    full_text = "\n".join(extracted_text_lines)

    # Постобработка (опционально)
    full_text = re.sub(r' +', ' ', full_text)
    full_text = re.sub(r'\n+', '\n', full_text).strip()

    return full_text

def download_article(article_url: str) -> str:
    """Скачивает PDF и возвращает извлечённый текст."""
    print(f"Скачивание статьи: {article_url}")
    try:
        response = requests.get(f"{article_url}/pdf", timeout=10)
        response.raise_for_status()
        file = BytesIO(response.content)
        time.sleep(3)  # Вежливая задержка
        return parse_pdf_with_pymupdf(file)
    except Exception as e:
        print(f"Ошибка скачивания: {e}")
        return ""


def save_text_to_file(text: str, filename: str):
    """Сохраняет текст в файл с указанным именем."""
    if not text.strip():
        print("Пустой текст - файл не создаётся")
        return

    filepath = DESTINATION_FOLDER / f"{filename}.txt"
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Файл сохранён: {filepath}")
    except Exception as e:
        print(f"Ошибка сохранения файла: {e}")


def handle(urls):
    """Основная функция обработки."""
    print("Парсер начал работу")
    DESTINATION_FOLDER.mkdir(exist_ok=True)  # Создаём папку, если не существует

    for url in urls:
        current_page = 1
        while True:
            print(f"\nОбработка категории '{url}', страница {current_page}")
            page_url = f"{BASE_URL_ARTICLES}/{url}/{current_page}"

            try:
                response = requests.get(page_url, timeout=10)
                soup = BeautifulSoup(response.text, 'html.parser')
                articles = soup.find_all('a', class_='title')

                if not articles:
                    print("Статьи не найдены - завершение обработки категории")
                    break

                print(f"Найдено {len(articles)} статей")

                for article in articles:
                    article_url = BASE_URL + article['href']
                    article_title = article.text.strip()
                    safe_title = re.sub(r'[\\/*?:"<>|]', "", article_title)[:100]  # Очистка имени файла

                    text = download_article(article_url)
                    if text:
                        save_text_to_file(text, safe_title)

                current_page += 1
                time.sleep(2)  # Задержка между страницами

            except Exception as e:
                print(f"Ошибка обработки страницы: {e}")
                break


if __name__ == "__main__":
    urls_to_parse = ['mathematics']
    handle(urls_to_parse)
    print("Работа завершена")