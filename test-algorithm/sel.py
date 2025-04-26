import io
import os
import re
import time
from io import BytesIO
from pathlib import Path

import PyPDF2
import fitz
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

BASE_URL = "https://cyberleninka.ru"
BASE_URL_ARTICLES = "https://cyberleninka.ru/article/c"
DESTINATION_FOLDER = Path("/home/vkuksa/identics/test-algorithm/downloaded")
PAGE_SIZE = 20


def setup_driver():
    """Настраивает и возвращает драйвер Selenium."""
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Запуск в фоновом режиме
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920x1080")
    # Добавляем пользовательский агент для имитации обычного браузера
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36")

    # Использование webdriver-manager для установки ChromeDriver
    # Задаем версию "stable" для использования стабильного драйвера
    try:
        service = Service(ChromeDriverManager(version="stable").install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
    except Exception as e:
        print(f"Ошибка при создании драйвера: {e}")
        # Альтернативный подход без использования webdriver-manager
        print("Пробуем альтернативный способ запуска драйвера...")
        driver = webdriver.Chrome(options=chrome_options)

    print("Драйвер Selenium успешно создан")
    return driver


# parse_and_perform_pdf
def parse_and_perform_pdf(pdf_data: io.BytesIO) -> str:
    """
    Извлекает текст из PDF (BytesIO), останавливаясь перед 'Литературой',
    агрессивно пропуская формулы, номера страниц, сноски, одиночные символы
    и ПЫТАЯСЬ СКЛЕИТЬ СТРОКИ ВНУТРИ АБЗАЦЕВ.
    """

    # --- Начало функции без изменений (все паттерны и эвристики остаются) ---
    literature_patterns = [
        re.compile(r'^\s*(\d+\.?\s*)?Л\s*И\s*Т\s*Е\s*Р\s*А\s*Т\s*У\s*Р\s*А\s*$', re.IGNORECASE | re.UNICODE),
        re.compile(r'^\s*(\d+\.?\s*)?С\s*П\s*И\s*С\s*О\s*К\s+Л\s*И\s*Т\s*Е\s*Р\s*А\s*Т\s*У\s*Р\s*Ы\s*$', re.IGNORECASE | re.UNICODE),
        re.compile(r'^\s*(\d+\.?\s*)?Б\s*И\s*Б\s*Л\s*И\s*О\s*Г\s*Р\s*А\s*Ф\s*И\s*Ч\s*Е\s*С\s*К\s*И\s*Й\s+С\s*П\s*И\s*С\s*О\s*К\s*$', re.IGNORECASE | re.UNICODE),
        re.compile(r'^\s*(\d+\.?\s*)?И\s*С\s*П\s*О\s*Л\s*Ь\s*З\s*О\s*В\s*А\s*Н\s*Н\s*(А\s*Я|Ы\s*Е)\s+(Л\s*И\s*Т\s*Е\s*Р\s*А\s*Т\s*У\s*Р\s*А|И\s*С\s*Т\s*О\s*Ч\s*Н\s*И\s*К\s*И)\s*$', re.IGNORECASE | re.UNICODE)
    ]
    image_pattern = re.compile(r'рис(унок|\.)?\s*\d+', re.IGNORECASE | re.UNICODE)
    page_number_pattern = re.compile(r'^\s*\d+\s*$')
    footnote_pattern = re.compile(r'^\s*\d+\s+[А-ЯЁ].*')
    formula_chars_common = r'[=+\-−×÷/\\%\[\]\(\)\{\}<>]'
    formula_chars_specific = r'[∫∑∏√∞∈∉⊂⊃⊆⊇∀∃∂∇≠≤≥≈∝→∩∅∗∫]'
    single_var_pattern = re.compile(r'\b[a-zA-Zα-ωΑ-Ω]\b')
    formula_keywords = re.compile(r'\b(min|max|lim|sup|inf|log|ln|exp|sin|cos|tan|ctg|arg)\b', re.IGNORECASE)
    digit_pattern = re.compile(r'\d')
    cyrillic_pattern = re.compile(r'[а-яА-ЯёЁ]')
    repeating_vars_pattern = re.compile(r'^\s*([a-zA-Zα-ωΑ-Ω]\s+){2,}[a-zA-Zα-ωΑ-Ω]?\s*$')
    short_non_cyrillic_pattern = re.compile(r'^[^\wа-яА-ЯёЁ]*[a-zA-Zα-ωΑ-Ω\d=+\-−×÷/\\%\[\]\(\)\{\}<>∫∑∏√∞∈∉⊂⊃⊆⊇∀∃∂∇≠≤≥≈∝→∩∅∗∫.,:;!?]+[^\wа-яА-ЯёЁ]*$')
    fraction_bracket_pattern = re.compile(r'[]')

    extracted_text_lines = []
    stop_extraction = False
    debug_prints = False # Установи в True для отладки срабатывания правил

    try:
        pdf_bytes = pdf_data.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")

        for page_num in range(len(doc)):
            if stop_extraction:
                break
            page = doc.load_page(page_num)
            # Получаем блоки - это может помочь с определением абзацев,
            # но для простоты пока остаемся на page.get_text("text")
            page_text = page.get_text("text")

            # Сохраняем строки как есть, включая пустые,
            # чтобы потом определить разрывы абзацев
            for line in page_text.split('\n'):
                # --- Вся логика фильтрации строк (пропуск формул и т.д.) ---
                line_stripped = line.strip()

                # Пропускаем номера страниц и сноски сразу
                if page_number_pattern.match(line_stripped):
                    if debug_prints: print(f"Skipping (Page Number): {line_stripped}")
                    continue
                if footnote_pattern.match(line_stripped):
                     if debug_prints: print(f"Skipping (Footnote): {line_stripped}")
                     continue

                # Проверяем на литературу (но не добавляем строку, если это она)
                normalized_for_literature = re.sub(r'\s+', '', line_stripped).lower()
                normalized_for_literature = re.sub(r'^(глава\d*\.?|раздел\d*\.?|\d+\.?)*', '', normalized_for_literature).strip()
                is_literature_header = False
                for pattern in literature_patterns:
                    if pattern.match(normalized_for_literature):
                         print(f"Найден раздел литературы: {line_stripped}")
                         stop_extraction = True
                         is_literature_header = True
                         break
                if is_literature_header: # Не добавляем сам заголовок литературы и прекращаем
                    break

                # Пропускаем строки с упоминанием рисунков
                if image_pattern.search(line_stripped):
                     if debug_prints: print(f"Skipping (Image Ref): {line_stripped}")
                     continue

                # --- Проверка на формулу ---
                is_likely_formula = False
                line_len_stripped = len(line_stripped)
                line_len_no_spaces = len(line_stripped.replace(" ", ""))

                if line_len_no_spaces > 0: # Проверяем непустые строки
                    # Эвристика 0: Одиночный символ (не кириллица)
                    if line_len_stripped == 1 and not cyrillic_pattern.match(line_stripped):
                         is_likely_formula = True
                         if debug_prints: print(f"Formula? (0: Single Non-Cyrillic Char): {line_stripped}")

                    if not is_likely_formula:
                        # Остальные эвристики 1-6...
                        specific_math_symbol_count = len(re.findall(formula_chars_specific, line_stripped))
                        common_math_symbol_count = len(re.findall(formula_chars_common, line_stripped))
                        single_var_count = len(re.findall(single_var_pattern, line_stripped))
                        keyword_count = len(re.findall(formula_keywords, line_stripped))
                        digit_count = len(re.findall(digit_pattern, line_stripped))
                        cyrillic_count = len(re.findall(cyrillic_pattern, line_stripped))
                        total_formula_related_chars = (specific_math_symbol_count + common_math_symbol_count +
                                                    single_var_count + keyword_count + digit_count)
                        # Эвристика 1
                        if specific_math_symbol_count > 0: is_likely_formula = True; #if debug_prints: print(f"Formula? (1): {line_stripped}")
                        # Эвристика 2
                        if not is_likely_formula and repeating_vars_pattern.match(line_stripped): is_likely_formula = True; #if debug_prints: print(f"Formula? (2): {line_stripped}")
                        # Эвристика 3
                        if not is_likely_formula and line_len_no_spaces < 5 and short_non_cyrillic_pattern.match(line_stripped):
                            if not re.fullmatch(r'[\s.,!?;:]+', line_stripped) and not re.fullmatch(r'\s*[a-zA-Zа-яА-ЯёЁ]{1,4}\.?\s*', line_stripped): is_likely_formula = True; #if debug_prints: print(f"Formula? (3): {line_stripped}")
                        # Эвристика 4
                        if not is_likely_formula and line_len_no_spaces > 3:
                            cyrillic_ratio = cyrillic_count / line_len_no_spaces
                            formula_chars_ratio = total_formula_related_chars / line_len_no_spaces
                            if cyrillic_ratio < 0.15 or (cyrillic_ratio < 0.3 and formula_chars_ratio > 0.6): is_likely_formula = True; #if debug_prints: print(f"Formula? (4): {line_stripped}")
                        # Эвристика 5
                        if not is_likely_formula and re.search(r'[⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]', line_stripped): is_likely_formula = True; #if debug_prints: print(f"Formula? (5): {line_stripped}")
                        # Эвристика 6
                        if not is_likely_formula and fraction_bracket_pattern.search(line_stripped): is_likely_formula = True; #if debug_prints: print(f"Formula? (6): {line_stripped}")

                # Если это вероятная формула, пропускаем
                if is_likely_formula:
                    if debug_prints: print(f"Skipping (Likely Formula): {line_stripped}")
                    continue
                # --- Конец фильтрации ---

                # Добавляем строку, прошедшую фильтры (сохраняем пустые строки для определения абзацев)
                extracted_text_lines.append(line) # Добавляем оригинальную строку

            if stop_extraction: # Если нашли литературу на этой странице, дальше не идем
                 break

        doc.close()

    except Exception as e:
        print(f"Ошибка при обработке PDF из BytesIO: {e}")
        return f"Error processing PDF from BytesIO: {e}"

    # --- Постобработка для склейки абзацев ---
    if not extracted_text_lines:
        return ""

    # Собираем текст, сохраняя переносы
    full_text = "\n".join(extracted_text_lines)

    # 1. Защищаем двойные (или более) переносы строк маркером
    paragraph_marker = " __PARAGRAPH_BREAK__ " # Маркер с пробелами
    full_text = re.sub(r'\n\s*\n+', paragraph_marker, full_text)

    # 2. Склеиваем переносы слов с удалением дефиса
    full_text = re.sub(r'-\n([а-яё])', r'\1', full_text, flags=re.UNICODE | re.IGNORECASE)

    # 3. Заменяем все оставшиеся (одиночные) переносы на пробелы
    full_text = full_text.replace('\n', ' ')

    # 4. Восстанавливаем разрывы абзацев из маркера
    full_text = full_text.replace(paragraph_marker, '\n\n')

    # 5. Убираем лишние пробелы
    full_text = re.sub(r' +', ' ', full_text)

    # 6. Убираем пробелы вокруг двойных переносов
    full_text = re.sub(r'\s*\n\n\s*', '\n\n', full_text)

    # 7. Убираем пробелы в начале/конце всего текста
    full_text = full_text.strip()

    return full_text


def download_article(driver, article_url: str) -> str:
    """Скачивает PDF с помощью Selenium и возвращает извлечённый текст."""
    print(f"Скачивание статьи: {article_url}")
    try:
        # Скачиваем PDF с помощью requests
        response = requests.get(article_url + "/pdf", timeout=10)
        response.raise_for_status()
        file = BytesIO(response.content)
        time.sleep(2)  # Вежливая задержка
        return parse_and_perform_pdf(file)
    except Exception as e:
        print(f"Ошибка скачивания статьи: {e}")
        import traceback
        traceback.print_exc()  # Выводим полный стек-трейс для отладки
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

    # Инициализируем драйвер
    driver = setup_driver()

    try:
        for url in urls:
            current_page = 2
            while True:
                print(f"\nОбработка категории '{url}', страница {current_page}")
                page_url = f"{BASE_URL_ARTICLES}/{url}/{current_page}"
                print(f"Загружаем URL: {page_url}")

                try:
                    # Загружаем страницу категории через Selenium
                    driver.get(page_url)

                    # Печатаем заголовок страницы для проверки загрузки
                    print(f"Заголовок страницы: {driver.title}")

                    # Ждем загрузки статей с увеличенным временем ожидания
                    try:
                        print("Ожидаем загрузки элементов...")
                        # Используем новый CSS селектор, основанный на анализе HTML
                        WebDriverWait(driver, 20).until(
                            EC.presence_of_element_located((By.CSS_SELECTOR, "ul.list li a"))
                        )
                        print("Элементы успешно найдены")
                    except TimeoutException:
                        print("Время ожидания загрузки статей истекло. Сохраняем HTML для анализа...")
                        with open("page_source.html", "w", encoding="utf-8") as f:
                            f.write(driver.page_source)
                        print("HTML сохранен в файл page_source.html")
                        break

                    # Получаем ссылки на статьи
                    article_elements = driver.find_elements(By.CSS_SELECTOR, "ul.list li a")

                    if not article_elements:
                        print("Статьи не найдены - завершение обработки категории")
                        break

                    print(f"Найдено {len(article_elements)} статей")

                    # Собираем информацию о статьях
                    articles_info = []
                    for article in article_elements:
                        article_url = article.get_attribute("href")
                        # Ищем элемент заголовка внутри ссылки
                        title_element = article.find_element(By.CSS_SELECTOR, "div.title")
                        article_title = title_element.text.strip() if title_element else "Без названия"
                        articles_info.append((article_url, article_title))

                    # Обрабатываем каждую статью
                    for article_url, article_title in articles_info:
                        safe_title = re.sub(r'[\\/*?:"<>|]', "", article_title)[:100]  # Очистка имени файла
                        text = download_article(driver, article_url)
                        if text:
                            save_text_to_file(text, safe_title)

                    current_page += 1
                    time.sleep(2)  # Задержка между страницами

                except Exception as e:
                    print(f"Ошибка обработки страницы: {e}")
                    import traceback
                    traceback.print_exc()  # Выводим полный стек-трейс для отладки
                    break
    finally:
        # Добавляем небольшую задержку перед закрытием драйвера
        print("Ожидаем перед закрытием драйвера...")
        time.sleep(5)

        # Закрываем драйвер
        driver.quit()
        print("Драйвер Selenium закрыт")


if __name__ == "__main__":
    urls_to_parse = ['mathematics']
    handle(urls_to_parse)
    print("Работа завершена")
