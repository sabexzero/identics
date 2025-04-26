import io
import os
import re
import time
from pathlib import Path

import fitz
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from bs4 import BeautifulSoup
import PyPDF2
from io import BytesIO

BASE_URL = "https://cyberleninka.ru"
DESTINATION_FOLDER = Path("/home/vkuksa/identics/test-algorithm/downloaded")  # Используем Path для кросс-платформенности
PAGE_SIZE = 20


def setup_driver():
    """Настройка Firefox WebDriver"""
    options = Options()
    options.headless = True  # Режим без графического интерфейса
    service = Service('geckodriver.exe')  # Укажите путь к geckodriver
    driver = webdriver.Firefox(service=service, options=options)
    driver.set_page_load_timeout(30)
    return driver


def parse_pdf(pdf_data: io.BytesIO) -> str: # <--- Меняем тип аргумента
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


def download_pdf(driver, url):
    """Скачивание PDF через Selenium"""
    try:
        driver.get(url)
        pdf_url = driver.find_element(By.XPATH, '//a[contains(@href,"/pdf")]').get_attribute('href')

        # Получаем PDF содержимое
        driver.get(pdf_url)
        time.sleep(3)  # Ожидание загрузки

        # Альтернативный способ через requests с сохранением cookies
        cookies = {c['name']: c['value'] for c in driver.get_cookies()}
        pdf_content = requests.get(pdf_url, cookies=cookies).content

        return BytesIO(pdf_content)
    except Exception as e:
        print(f"Download error: {e}")
        return None


def process_articles(driver, category):
    """Основная функция обработки статей"""
    page_num = 1
    DESTINATION_FOLDER.mkdir(exist_ok=True)

    while True:
        url = f"{BASE_URL}/article/c/{category}/{page_num}"
        print(f"Processing: {url}")

        try:
            driver.get(url)
            time.sleep(2)  # Ожидание загрузки

            # Парсим список статей
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            articles = soup.find_all('li', class_='full')

            if not articles:
                print("No more articles found")
                break

            for article in articles:
                try:
                    title = article.find('h2').text.strip()
                    link = BASE_URL + article.find('a')['href']
                    print(f"\nFound article: {title}")

                    pdf_file = download_pdf(driver, link)
                    if pdf_file:
                        text = parse_pdf(pdf_file)
                        if text:
                            filename = re.sub(r'[^\w\s-]', '', title)[:100] + ".txt"
                            (DESTINATION_FOLDER / filename).write_text(text, encoding='utf-8')
                            print(f"Saved: {filename}")

                    time.sleep(2)  # Вежливая пауза

                except Exception as e:
                    print(f"Article processing error: {e}")
                    continue

            page_num += 1

        except Exception as e:
            print(f"Page error: {e}")
            break


if __name__ == "__main__":
    driver = setup_driver()
    try:
        categories = ['mathematics']
        for cat in categories:
            process_articles(driver, cat)
    finally:
        driver.quit()
    print("Processing complete")