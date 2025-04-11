package org.identics.monolith.service;

import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.check.Check;
import org.identics.monolith.domain.check.CheckContent;
import org.identics.monolith.domain.check.ContentType;
import org.identics.monolith.dto.TagDTO;
import org.identics.monolith.repository.CheckContentRepository;
import org.identics.monolith.repository.CheckRepository;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final CheckContentRepository contentRepository;
    private final CheckRepository checkRepository;
    private final TagService tagService;
    
    public Resource generateReport(Long documentId, String format) {
        CheckContent content = contentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        
        Optional<Check> checkOpt = checkRepository.findFirstByContentIdOrderByIdDesc(content.getId());
        Check check = checkOpt.orElseThrow(() -> new IllegalArgumentException("Check result not found"));
        
        // Получаем теги документа
        List<TagDTO> tags = tagService.getDocumentTags(documentId);
        
        // Генерация отчета
        String report;
        if (format.equalsIgnoreCase("pdf")) {
            report = generatePdfReport(content, check, tags);
        } else {
            report = generateHtmlReport(content, check, tags);
        }
        
        return new ByteArrayResource(report.getBytes(StandardCharsets.UTF_8));
    }
    
    private String generatePdfReport(CheckContent content, Check check, List<TagDTO> tags) {
        // В реальном приложении здесь генерировался бы PDF документ
        // Для прототипа просто возвращаем HTML с заголовком PDF
        return "PDF REPORT\n" + generateHtmlReport(content, check, tags);
    }
    
    private String generateHtmlReport(CheckContent content, Check check, List<TagDTO> tags) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><title>Отчет о проверке</title>");
        html.append("<meta charset=\"UTF-8\">");
        html.append("<style>body { font-family: Arial, sans-serif; margin: 20px; }");
        html.append("table { border-collapse: collapse; width: 100%; }");
        html.append("th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }");
        html.append("th { background-color: #f2f2f2; }");
        html.append(".header { background-color: #4CAF50; color: white; padding: 10px; margin-bottom: 20px; }");
        html.append(".result { margin-top: 20px; padding: 10px; border: 1px solid #ddd; }");
        html.append(".high { color: red; }");
        html.append(".medium { color: orange; }");
        html.append(".low { color: green; }");
        html.append("</style></head><body>");
        
        // Шапка отчета
        html.append("<div class=\"header\"><h1>Отчет о проверке на плагиат</h1></div>");
        
        // Информация о документе
        html.append("<h2>Информация о документе</h2>");
        html.append("<table>");
        html.append("<tr><th>Название</th><td>").append(content.getTitle()).append("</td></tr>");
        html.append("<tr><th>Тип контента</th><td>").append(content.getContentType() == ContentType.FILE ? "Файл" : "Текст").append("</td></tr>");
        html.append("<tr><th>Дата проверки</th><td>").append(check.getDateTime().format(formatter)).append("</td></tr>");
        
        // Теги
        html.append("<tr><th>Теги</th><td>");
        if (tags.isEmpty()) {
            html.append("<em>Нет тегов</em>");
        } else {
            tags.forEach(tag -> html.append("<span style=\"margin-right: 10px; padding: 3px 7px; background-color: #eee; border-radius: 3px;\">")
                    .append(tag.getName())
                    .append("</span>"));
        }
        html.append("</td></tr>");
        html.append("</table>");
        
        // Результаты проверки
        html.append("<h2>Результаты проверки</h2>");
        html.append("<div class=\"result\">");
        
        // Результаты проверки на плагиат
        String plagiarismClass = check.getPlagiarismLevel() > 50 ? "high" : (check.getPlagiarismLevel() > 20 ? "medium" : "low");
        html.append("<h3>Проверка на плагиат</h3>");
        html.append("<p>Статус: <strong>").append(check.getPlagiarismCheckStatus()).append("</strong></p>");
        html.append("<p>Уровень плагиата: <strong class=\"").append(plagiarismClass).append("\">")
                .append(String.format("%.2f", check.getPlagiarismLevel())).append("%</strong></p>");
        
        // Результаты проверки на AI-генерацию
        String aiClass = check.getAiCheckLevel() > 70 ? "high" : (check.getAiCheckLevel() > 40 ? "medium" : "low");
        html.append("<h3>Проверка на AI-генерацию</h3>");
        html.append("<p>Статус: <strong>").append(check.getAiCheckStatus()).append("</strong></p>");
        html.append("<p>Вероятность AI-генерации: <strong class=\"").append(aiClass).append("\">")
                .append(check.getAiCheckLevel()).append("%</strong></p>");
        
        html.append("</div>");
        
        // Заключение
        html.append("<h2>Заключение</h2>");
        html.append("<p>Данный документ ");
        if (check.getPlagiarismLevel() > 50) {
            html.append("имеет <strong class=\"high\">высокий</strong> уровень плагиата. Рекомендуется тщательная переработка.");
        } else if (check.getPlagiarismLevel() > 20) {
            html.append("имеет <strong class=\"medium\">средний</strong> уровень плагиата. Рекомендуется частичная переработка.");
        } else {
            html.append("имеет <strong class=\"low\">низкий</strong> уровень плагиата. Документ является оригинальным.");
        }
        html.append("</p>");
        
        // Рекомендации
        html.append("<h2>Рекомендации</h2>");
        if (check.getPlagiarismLevel() > 30) {
            html.append("<ul>");
            html.append("<li>Переформулируйте предложения, выявленные как плагиат</li>");
            html.append("<li>Добавьте корректные цитирования и ссылки на источники</li>");
            html.append("<li>Увеличьте долю оригинального контента</li>");
            html.append("</ul>");
        } else {
            html.append("<p>Специальных рекомендаций нет. Документ соответствует требованиям оригинальности.</p>");
        }
        
        html.append("</body></html>");
        return html.toString();
    }
} 