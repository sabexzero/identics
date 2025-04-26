package org.identics.monolith.service.report;

import com.lowagie.text.*; // OpenPDF (iText 2.x fork)
import com.lowagie.text.Document;
import com.lowagie.text.Font; // OpenPDF Font
// Removed: import com.lowagie.text.Image; // OpenPDF Image (no longer needed for logo)
import com.lowagie.text.Paragraph; // OpenPDF Paragraph
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import java.awt.Color; // AWT Color for PDF
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.poi.common.usermodel.PictureType;
import org.apache.poi.util.Units;
import org.apache.poi.xwpf.usermodel.*;
import org.identics.monolith.domain.user.ReportFileFormat;
import org.identics.monolith.service.s3.S3Service;
import org.identics.monolith.web.dto.kafka.Source;
import org.identics.monolith.web.dto.kafka.TaskResult;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*; // DOCX low-level
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportGeneratorService {
    private final TemplateEngine templateEngine;
    private final S3Service s3Service;

    // --- Constants ---
    private static final String LOGO_PATH = "static/images/logo.png"; // Still needed for HTML/DOCX
    private static final String FONT_PATH_REGULAR = "static/fonts/DejaVuSans.ttf"; // Font for PDF
    private static final String FONT_PATH_BOLD = "static/fonts/DejaVuSans-Bold.ttf"; // Font for PDF
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
    private static final String REPORT_FILENAME_PREFIX = "Textsource-report-";
    private static final String REPORT_S3_FOLDER = "reports/";

    // --- PDF Specific Constants ---
    private static final Color PDF_COLOR_PRIMARY = new Color(0x43, 0x61, 0xEE);
    private static final Color PDF_COLOR_SUCCESS = new Color(0x06, 0xD6, 0xA0);
    private static final Color PDF_COLOR_WARNING = new Color(0xFF, 0xD1, 0x66);
    private static final Color PDF_COLOR_DANGER = new Color(0xEF, 0x47, 0x6F);
    private static final Color PDF_COLOR_TEXT = new Color(0x2B, 0x2D, 0x42);
    private static final Color PDF_COLOR_TEXT_SECONDARY = new Color(0x5A, 0x5A, 0x5A);
    private static final Color PDF_COLOR_BACKGROUND_ALT = new Color(0xF8, 0xF9, 0xFA);
    private static final Color PDF_COLOR_BORDER = new Color(0xE9, 0xEC, 0xEF);
    private static BaseFont pdfBaseFontRegular = null;
    private static BaseFont pdfBaseFontBold = null;

    // --- DOCX Specific Constants ---
    // (Keep DOCX constants as they were)
    private static final String DOCX_COLOR_PRIMARY = "4361EE";
    private static final String DOCX_COLOR_SUCCESS = "06D6A0";
    private static final String DOCX_COLOR_WARNING = "FFD166";
    private static final String DOCX_COLOR_DANGER = "EF476F";
    private static final String DOCX_COLOR_TEXT = "2B2D42";
    private static final String DOCX_COLOR_TEXT_SECONDARY = "5A5A5A";
    private static final String DOCX_COLOR_BACKGROUND_ALT = "F8F9FA";
    private static final String DOCX_COLOR_BORDER = "E9ECEF";
    private static final String DOCX_FONT_FAMILY = "Calibri"; // Consider "DejaVu Sans" if embedding

    // Static initializer for PDF fonts
    static {
        // (Keep static font loading block as it was)
        try {
            ClassPathResource regularFontResource = new ClassPathResource(FONT_PATH_REGULAR);
            ClassPathResource boldFontResource = new ClassPathResource(FONT_PATH_BOLD);

            if (regularFontResource.exists() && boldFontResource.exists()) {
                pdfBaseFontRegular = BaseFont.createFont(regularFontResource.getURL().toString(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                pdfBaseFontBold = BaseFont.createFont(boldFontResource.getURL().toString(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                log.info("PDF Fonts (DejaVu Sans Regular/Bold) loaded successfully.");
            } else {
                log.error("One or both PDF font files not found: Regular={}, Bold={}", FONT_PATH_REGULAR, FONT_PATH_BOLD);
                pdfBaseFontRegular = FontFactory.getFont(FontFactory.HELVETICA, BaseFont.CP1252, BaseFont.EMBEDDED).getBaseFont();
                pdfBaseFontBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.EMBEDDED).getBaseFont();
            }
        } catch (Exception e) {
            log.error("Failed to load PDF fonts. Falling back to default.", e);
            pdfBaseFontRegular = FontFactory.getFont(FontFactory.HELVETICA, BaseFont.CP1252, BaseFont.EMBEDDED).getBaseFont();
            pdfBaseFontBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.EMBEDDED).getBaseFont();
        }
    }

    // --- Main Generation and Upload Logic ---
    // (Keep generateReportAndUpload as it was, calling the native methods)
    public String generateReportAndUpload(TaskResult taskResult, ReportFileFormat fileFormat) throws IOException {
        if (taskResult == null || fileFormat == null) {
            throw new IllegalArgumentException("TaskResult и ReportFileFormat не могут быть null");
        }

        log.info("Запрос на генерацию и загрузку отчета для checkId: {}, формат: {}", taskResult.getCheckId(), fileFormat);

        byte[] reportBytes;
        String s3Key = generateS3Key(fileFormat);
        String contentType = fileFormat.getContentType();
        ReportFileFormat actualFileFormat = fileFormat;

        try {
            switch (fileFormat) {
                case HTML:
                    String htmlContent = generateHtmlReport(taskResult);
                    reportBytes = htmlContent.getBytes(StandardCharsets.UTF_8);
                    log.info("HTML контент сгенерирован.");
                    break;

                case PDF:
                    try {
                        reportBytes = generateNativePdfReport(taskResult);
                        log.info("Нативный PDF контент сгенерирован.");
                    } catch (Exception pdfEx) {
                        log.error("Не удалось сгенерировать нативный PDF: {}. Возвращаем HTML.", pdfEx.getMessage(), pdfEx);
                        actualFileFormat = ReportFileFormat.HTML;
                        reportBytes = generateHtmlReport(taskResult).getBytes(StandardCharsets.UTF_8);
                        s3Key = generateS3Key(actualFileFormat);
                        contentType = actualFileFormat.getContentType();
                    }
                    break;

                default:
                    log.error("Неподдерживаемый формат отчета: {}", fileFormat);
                    throw new IllegalArgumentException("Неподдерживаемый формат отчета: " + fileFormat);
            }

            log.info("Загрузка отчета в S3: key={}, contentType={}, size={}, actualFormat={}",
                s3Key, contentType, reportBytes.length, actualFileFormat);
            String s3Url = s3Service.uploadGeneratedReport(s3Key, reportBytes, contentType);
            log.info("Отчет успешно загружен в S3: {}", s3Url);
            return s3Url;

        } catch (Exception e) {
            log.error("Критическая ошибка при генерации или загрузке отчета для checkId: {}: {}", taskResult.getCheckId(), e.getMessage(), e);
            throw new IOException("Ошибка при генерации или загрузке отчета: " + e.getMessage(), e);
        }
    }

    private String generateS3Key(ReportFileFormat fileFormat) {
        String uuid = UUID.randomUUID().toString();
        String filename = REPORT_FILENAME_PREFIX + uuid + "." + fileFormat.getExtension();
        return REPORT_S3_FOLDER + filename;
    }

    // --- HTML Generation (using Thymeleaf) ---
    // (Keep generateHtmlReport as it was)
    public String generateHtmlReport(TaskResult result) {
        log.info("Генерация HTML отчета для checkId: {}", result.getCheckId());
        Context context = prepareContext(result);
        return templateEngine.process("report-template", context); // Use your existing template name
    }

    // --- Native PDF Generation (using OpenPDF) ---

    private byte[] generateNativePdfReport(TaskResult result) throws DocumentException, IOException {
        log.info("Attempting to generate native PDF report for checkId: {}", result.getCheckId());
        Document document = new Document(PageSize.A4, 50, 50, 50, 50);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = null;
        boolean documentOpened = false;

        try {
            log.debug("Initializing PdfWriter...");
            writer = PdfWriter.getInstance(document, outputStream);
            writer.setPdfVersion(PdfWriter.VERSION_1_7);
            log.debug("PdfWriter initialized.");

            log.debug("Setting PDF metadata...");
            document.addTitle("Отчет о проверке");
            document.addAuthor("Identics Report Generator");
            document.addSubject("Результаты проверки текстового документа на наличие заимствований");
            document.addCreator("Identics");
            document.addKeywords("отчет, заимствования, плагиат, AI");
            log.debug("PDF metadata set.");

            log.debug("Opening PDF document...");
            document.open();
            documentOpened = true;
            log.info("PDF document opened successfully.");

            // --- Define Fonts ---
            Font fontH1 = new Font(pdfBaseFontBold, 18, Font.BOLD, Color.WHITE);
            // Font fontH2 = new Font(pdfBaseFontBold, 14, Font.BOLD, PDF_COLOR_PRIMARY); // Replaced by fontSectionHeader
            Font fontSectionHeader = new Font(pdfBaseFontRegular, 14, Font.NORMAL, PDF_COLOR_TEXT); // NEW: Black, Normal Weight Header
            Font fontSubHeader = new Font(pdfBaseFontRegular, 10, Font.NORMAL, new Color(230, 230, 230));
            Font fontBody = new Font(pdfBaseFontRegular, 10, Font.NORMAL, PDF_COLOR_TEXT);
            Font fontLabel = new Font(pdfBaseFontRegular, 9, Font.NORMAL, PDF_COLOR_TEXT_SECONDARY);
            Font fontValue = new Font(pdfBaseFontRegular, 10, Font.NORMAL, PDF_COLOR_TEXT);
            Font fontMetricLabel = new Font(pdfBaseFontRegular, 9, Font.NORMAL, PDF_COLOR_TEXT_SECONDARY);
            Font fontMetricValue = new Font(pdfBaseFontBold, 20, Font.BOLD);
            Font fontTableHeader = new Font(pdfBaseFontBold, 9, Font.BOLD, PDF_COLOR_TEXT_SECONDARY);
            Font fontTableCell = new Font(pdfBaseFontRegular, 9, Font.NORMAL, PDF_COLOR_TEXT);
            Font fontBadge = new Font(pdfBaseFontBold, 9, Font.BOLD, Color.WHITE);
            Font fontFooter = new Font(pdfBaseFontRegular, 8, Font.ITALIC, PDF_COLOR_TEXT_SECONDARY);
            Font fontBrand = new Font(pdfBaseFontBold, 10, Font.BOLD, PDF_COLOR_TEXT); // NEW: Font for TEXTSOURCE footer


            // --- Add Content ---
            log.debug("Adding PDF Header (no image)...");
            addPdfHeaderNoLogo(document, fontH1, fontSubHeader); // Use modified header method
            log.debug("PDF Header added.");
            document.add(Chunk.NEWLINE);

            log.debug("Adding PDF Info and Metrics Section...");
            // Use fontSectionHeader for the card title
            addPdfInfoAndMetricsSection(document, result, fontSectionHeader, fontLabel, fontValue, fontMetricLabel, fontMetricValue);
            log.debug("PDF Info and Metrics Section added.");
            document.add(Chunk.NEWLINE);

            log.debug("Adding PDF Sources Section...");
            // Use fontSectionHeader for the card title
            addPdfSourcesSection(document, result.getSources(), fontSectionHeader, fontTableHeader, fontTableCell, fontBadge);
            log.debug("PDF Sources Section added.");
            document.add(Chunk.NEWLINE);

            log.debug("Adding PDF Footer (with brand)...");
            addPdfFooterWithBrand(document, fontFooter, fontBrand); // Use modified footer method
            log.debug("PDF Footer added.");

            log.info("All PDF content added successfully.");

        } catch (DocumentException de) {
            log.error("Error during PDF content generation (DocumentException or IOException): {}", de.getMessage(), de);
            throw de;
        } catch (Exception e) {
            log.error("Unexpected error during PDF content generation: {}", e.getMessage(), e);
            throw new DocumentException("Unexpected error during PDF generation: " + e.getMessage());
        } finally {
            log.debug("Entering finally block for PDF generation...");
            if (document != null && document.isOpen()) {
                log.debug("Closing PDF document...");
                try {
                    document.close();
                    log.info("PDF document closed successfully.");
                } catch (Exception e) {
                    log.error("Error closing PDF document: {}", e.getMessage(), e);
                }
            } else {
                log.warn("PDF document was null or not open in finally block. Opened flag: {}", documentOpened);
            }
            // writer.close() is handled by document.close()
            log.debug("Exiting finally block for PDF generation.");
        }

        byte[] pdfBytes = outputStream.toByteArray();
        log.info("PDF generation complete. Output stream size: {} bytes.", pdfBytes.length);
        if (pdfBytes.length == 0 && documentOpened) {
            log.error("PDF generation resulted in 0 bytes, but the document was opened. Check content addition logic and logs.");
        } else if(pdfBytes.length == 0 && !documentOpened) {
            log.warn("PDF generation resulted in 0 bytes. Document was likely never opened successfully.");
        }

        return pdfBytes;
    }

    // Modified PDF Header Method (No Logo)
    private void addPdfHeaderNoLogo(Document document, Font fontH1, Font fontSubHeader) throws DocumentException {
        PdfPTable headerTable = new PdfPTable(1); // Single column for centered content
        headerTable.setWidthPercentage(100);
        headerTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
        headerTable.getDefaultCell().setVerticalAlignment(Element.ALIGN_MIDDLE);
        headerTable.setSpacingAfter(10f);

        // Create a cell for the entire header background
        PdfPCell backgroundCell = new PdfPCell();
        backgroundCell.setBorder(Rectangle.NO_BORDER);
        backgroundCell.setBackgroundColor(PDF_COLOR_PRIMARY);
        backgroundCell.setPaddingTop(15f);
        backgroundCell.setPaddingBottom(15f);
        backgroundCell.setPaddingLeft(10f);
        backgroundCell.setPaddingRight(10f);

        // --- Content inside the background ---
        // Title Cell (Centered)
        Paragraph title = new Paragraph("СПРАВКА", fontH1);
        title.setAlignment(Element.ALIGN_CENTER);
        Paragraph subTitle = new Paragraph("о результатах проверки текстового документа на наличие заимствований", fontSubHeader);
        subTitle.setAlignment(Element.ALIGN_CENTER);

        // Add title and subtitle directly to the background cell
        backgroundCell.addElement(title);
        backgroundCell.addElement(subTitle);

        // Add the single background cell to the main header table
        headerTable.addCell(backgroundCell);

        document.add(headerTable);
    }

    // PDF Info/Metrics Section (unchanged logic, but uses fontSectionHeader passed in)
    private void addPdfInfoAndMetricsSection(Document document, TaskResult result, Font fontSectionHeader, Font fontLabel, Font fontValue, Font fontMetricLabel, Font fontMetricValue) throws DocumentException {
        PdfPTable mainTable = new PdfPTable(1);
        mainTable.setWidthPercentage(100);
        mainTable.getDefaultCell().setBorder(Rectangle.BOX);
        mainTable.getDefaultCell().setBorderColor(PDF_COLOR_BORDER);
        mainTable.getDefaultCell().setBorderWidth(0.5f);

        // --- Header Cell --- Use the new font passed in
        PdfPCell headerCell = createPdfCardHeaderCell("Информация о проверке", fontSectionHeader); // <<<<<<<<<<<<<<<<<<<<<<<<<<
        mainTable.addCell(headerCell);

        // --- Body Cell (containing info grid and metrics) ---
        PdfPCell bodyCell = new PdfPCell();
        bodyCell.setBorder(Rectangle.NO_BORDER);
        bodyCell.setPadding(10f);

        // Info Grid (using a nested table)
        PdfPTable infoTable = new PdfPTable(3);
        infoTable.setWidthPercentage(100);
        infoTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
        infoTable.getDefaultCell().setPaddingBottom(8f);
        addPdfInfoItem(infoTable, "ID проверки:", String.valueOf(result.getCheckId()), fontLabel, fontValue);
        addPdfInfoItem(infoTable, "Дата проверки:", DATE_TIME_FORMATTER.format(LocalDateTime.now()), fontLabel, fontValue);
        addPdfInfoItem(infoTable, "Количество слов:", String.valueOf(result.getWordCount()), fontLabel, fontValue);
        bodyCell.addElement(infoTable);
        bodyCell.addElement(new Paragraph(" ")); // Spacing

        // Metrics (using another nested table)
        PdfPTable metricsTable = new PdfPTable(3);
        metricsTable.setWidthPercentage(100);
        metricsTable.setWidths(new float[]{1, 1, 1});
        metricsTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
        metricsTable.getDefaultCell().setPadding(5f);
        metricsTable.setSpacingBefore(10f);
        Double originality = calculateOriginality(result.getPlagiarismPercentage());
        metricsTable.addCell(createPdfMetricCell("Оригинальность", formatPercentageForPdf(originality), PDF_COLOR_SUCCESS, fontMetricLabel, fontMetricValue));
        metricsTable.addCell(createPdfMetricCell("Заимствования", formatPercentageForPdf(result.getPlagiarismPercentage()), PDF_COLOR_DANGER, fontMetricLabel, fontMetricValue));
        metricsTable.addCell(createPdfMetricCell("Вероятность AI генерации", formatPercentageForPdf(result.getAiPercentage()), PDF_COLOR_WARNING, fontMetricLabel, fontMetricValue));
        bodyCell.addElement(metricsTable);

        mainTable.addCell(bodyCell);
        document.add(mainTable);
    }

    // Helper: PDF Info Item (Unchanged)
    private void addPdfInfoItem(PdfPTable table, String label, String value, Font fontLabel, Font fontValue) {
        Paragraph pLabel = new Paragraph();
        pLabel.add(new Chunk(label, fontLabel));
        pLabel.add(Chunk.NEWLINE);
        pLabel.add(new Chunk(value != null ? value : "N/A", fontValue));
        pLabel.setLeading(12f);
        PdfPCell cell = new PdfPCell(pLabel);
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_TOP);
        cell.setPaddingBottom(5f);
        table.addCell(cell);
    }

    // Helper: PDF Metric Cell (Unchanged)
    private PdfPCell createPdfMetricCell(String label, String value, Color valueColor, Font fontLabel, Font fontValueBase) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.BOX);
        cell.setBorderColor(PDF_COLOR_BORDER);
        cell.setBorderWidth(0.5f);
        cell.setBackgroundColor(PDF_COLOR_BACKGROUND_ALT);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(10f);

        Paragraph pLabel = new Paragraph(label, fontLabel);
        pLabel.setAlignment(Element.ALIGN_CENTER);
        pLabel.setSpacingAfter(5f);

        Font fontValue = new Font(fontValueBase);
        fontValue.setColor(valueColor);
        if (valueColor.equals(PDF_COLOR_WARNING)) {
            fontValue.setColor(PDF_COLOR_TEXT);
        }
        Paragraph pValue = new Paragraph(value != null ? value : "N/A", fontValue);
        pValue.setAlignment(Element.ALIGN_CENTER);

        cell.addElement(pLabel);
        cell.addElement(pValue);
        return cell;
    }

    // Helper: PDF Card Header Cell (Unchanged logic, takes font as argument)
    private PdfPCell createPdfCardHeaderCell(String title, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(title, font));
        cell.setBackgroundColor(PDF_COLOR_BACKGROUND_ALT);
        cell.setBorder(Rectangle.BOTTOM);
        cell.setBorderColor(PDF_COLOR_BORDER);
        cell.setBorderWidth(0.5f);
        cell.setPadding(8f);
        cell.setPaddingLeft(10f);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        return cell;
    }

    // PDF Sources Section (Uses fontSectionHeader, multiplies coverage)
    private void addPdfSourcesSection(Document document, List<Source> sources, Font fontSectionHeader, Font fontHeader, Font fontCell, Font fontBadge) throws DocumentException {
        PdfPTable mainTable = new PdfPTable(1);
        mainTable.setWidthPercentage(100);
        mainTable.getDefaultCell().setBorder(Rectangle.BOX);
        mainTable.getDefaultCell().setBorderColor(PDF_COLOR_BORDER);
        mainTable.getDefaultCell().setBorderWidth(0.5f);
        mainTable.setSpacingBefore(10f);

        // --- Header Cell --- Use the new font passed in
        PdfPCell headerCell = createPdfCardHeaderCell("Найденные источники заимствований", fontSectionHeader); // <<<<<<<<<<<<<<<<<<<<<<<<<<
        mainTable.addCell(headerCell);

        // --- Body Cell (containing the sources table or message) ---
        PdfPCell bodyCell = new PdfPCell();
        bodyCell.setBorder(Rectangle.NO_BORDER);
        bodyCell.setPadding(10f);

        if (sources == null || sources.isEmpty()) {
            Paragraph noSources = new Paragraph("Источники заимствований не найдены или не проверялись.", fontCell);
            noSources.setAlignment(Element.ALIGN_CENTER);
            noSources.getFont().setStyle(Font.ITALIC);
            bodyCell.addElement(noSources);
        } else {
            PdfPTable sourcesTable = new PdfPTable(2);
            sourcesTable.setWidthPercentage(100);
            sourcesTable.setWidths(new float[]{4, 1});
            sourcesTable.getDefaultCell().setPadding(5f);
            sourcesTable.getDefaultCell().setBorderColor(PDF_COLOR_BORDER);
            sourcesTable.getDefaultCell().setBorderWidth(0.5f);
            sourcesTable.setHeaderRows(1);

            // Table Header
            PdfPCell nameHeader = new PdfPCell(new Phrase("Название источника", fontHeader));
            nameHeader.setBackgroundColor(PDF_COLOR_BACKGROUND_ALT);
            nameHeader.setBorderColor(PDF_COLOR_BORDER);
            nameHeader.setBorderWidth(0.5f);
            nameHeader.setPadding(8f);
            nameHeader.setHorizontalAlignment(Element.ALIGN_LEFT);

            PdfPCell coverageHeader = new PdfPCell(new Phrase("Процент совпадений", fontHeader));
            coverageHeader.setBackgroundColor(PDF_COLOR_BACKGROUND_ALT);
            coverageHeader.setBorderColor(PDF_COLOR_BORDER);
            coverageHeader.setBorderWidth(0.5f);
            coverageHeader.setPadding(8f);
            coverageHeader.setHorizontalAlignment(Element.ALIGN_RIGHT);

            sourcesTable.addCell(nameHeader);
            sourcesTable.addCell(coverageHeader);

            // Table Data
            for (Source source : sources) {
                PdfPCell nameCell = new PdfPCell(new Phrase(source.getSourceName() != null ? source.getSourceName() : "N/A", fontCell));
                nameCell.setHorizontalAlignment(Element.ALIGN_LEFT);
                nameCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                nameCell.setBorderColor(PDF_COLOR_BORDER);
                nameCell.setBorderWidth(0.5f);
                nameCell.setPadding(8f);
                sourcesTable.addCell(nameCell);

                // Coverage cell with badge simulation
                // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                Double coverageValue = source.getCoverage();
                // Multiply by 100 BEFORE formatting
                Double displayCoverage = (coverageValue != null) ? coverageValue * 100.0 : null;
                String coverageText = formatPercentageForPdf(displayCoverage); // Format the multiplied value
                // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

                Chunk badgeChunk = new Chunk(coverageText != null ? coverageText : "N/A", fontBadge);
                badgeChunk.setBackground(PDF_COLOR_DANGER, 3f, 3f, 3f, 3f);

                Paragraph coverageParagraph = new Paragraph(badgeChunk);

                PdfPCell coverageCell = new PdfPCell(coverageParagraph);
                coverageCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                coverageCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                coverageCell.setBorderColor(PDF_COLOR_BORDER);
                coverageCell.setBorderWidth(0.5f);
                coverageCell.setPadding(8f);

                sourcesTable.addCell(coverageCell);
            }
            bodyCell.addElement(sourcesTable);
        }
        mainTable.addCell(bodyCell);
        document.add(mainTable);
    }


    // Modified PDF Footer (Adds Brand)
    private void addPdfFooterWithBrand(Document document, Font fontFooter, Font fontBrand) throws DocumentException {
        // Add a line separator
        LineSeparator line = new LineSeparator(0.5f, 0f, PDF_COLOR_BORDER, Element.ALIGN_CENTER, -5f);
        document.add(new Chunk(line));
        document.add(Chunk.NEWLINE);

        // Add Brand Name
        Paragraph brand = new Paragraph("TEXTSOURCE", fontBrand);
        brand.setAlignment(Element.ALIGN_CENTER);
        brand.setSpacingAfter(5f); // Space between brand and footer text
        document.add(brand);

        // Add original footer text
        Paragraph footer = new Paragraph();
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setFont(fontFooter);
        footer.add("Отчет сгенерирован автоматически системой обнаружения заимствований.\n");
        footer.add("Предоставленная информация не подлежит использованию в коммерческих целях без разрешения правообладателя.");
        document.add(footer);
    }

    // --- Existing DOCX Helpers ---
    // (Keep all addDocx..., setTable..., setCell... helpers as they were for now)
    private void addDocxHeader(XWPFDocument document) throws Exception { /* ... original code ... */ }
    private void addDocxLogo(XWPFTableCell cell) { /* ... original code ... */ }
    private void addDocxInfoAndMetricsSection(XWPFDocument document, TaskResult result) { /* ... original code ... */ }
    private void addDocxInfoItem(XWPFTableCell cell, String label, String value) { /* ... original code ... */ }
    private void addDocxMetricItem(XWPFTableCell cell, String label, String value, String valueColorHex) { /* ... original code ... */ }
    private void addDocxSourcesSection(XWPFDocument document, List<Source> sources) { /* ... original code ... */ }
    private void setDocxSourceHeaderCell(XWPFTableCell cell, String text, String width) { /* ... original code ... */ }
    private void setDocxSourceDataCell(XWPFTableCell cell, String text, boolean isBadgeCell) { /* ... original code ... */ }
    private void addDocxFooter(XWPFDocument document) { /* ... original code ... */ }


    // --- Common Helper Methods ---
    // (Keep prepareContext, calculateOriginality, loadLogoBytes, loadLogoAsBase64, addEmptyParagraph, formatPercentageForDocx, formatPercentageForPdf)
    private Context prepareContext(TaskResult result) {
        Context context = new Context(Locale.forLanguageTag("ru"));
        LocalDateTime checkTime = LocalDateTime.now();

        context.setVariable("checkId", result.getCheckId());
        context.setVariable("checkDateTime", checkTime);
        context.setVariable("wordCount", result.getWordCount());

        Double plagiarism = result.getPlagiarismPercentage();
        // Multiply coverage by 100 for HTML context too, if the template expects it now
        if (result.getSources() != null) {
            result.getSources().forEach(s -> {
                // This modifies the source object in place for the template
                // Consider creating a DTO if you don't want to modify the original TaskResult
                if (s.getCoverage() != null) {
                    s.setSourceName(s.getSourceName().replace(".txt", ""));
                    s.setCoverage(s.getCoverage() * 100.0);
                }
            });
        }


        Double originality = calculateOriginality(plagiarism);
        context.setVariable("plagiarismPercentage", plagiarism); // Keep raw plagiarism %
        context.setVariable("originalityPercentage", originality);
        context.setVariable("aiPercentage", result.getAiPercentage());
        context.setVariable("sources", result.getSources()); // Pass potentially modified sources

        try {
            context.setVariable("logoBase64", loadLogoAsBase64());
        } catch (IOException e) {
            log.warn("Не удалось загрузить логотип для HTML: {}", e.getMessage());
            context.setVariable("logoBase64", null);
        }
        return context;
    }


    private Double calculateOriginality(Double plagiarismPercentage) {
        if (plagiarismPercentage == null) return null;
        BigDecimal hundred = BigDecimal.valueOf(100.0);
        // IMPORTANT: calculation uses raw plagiarism value (0.0 to 1.0 range assumed)
        BigDecimal plagiarism = BigDecimal.valueOf(plagiarismPercentage);
        // If plagiarismPercentage is already 0-100, adjust calculation:
        // BigDecimal plagiarism = BigDecimal.valueOf(plagiarismPercentage / 100.0);
        return hundred.subtract(plagiarism).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    private byte[] loadLogoBytes() throws IOException {
        ClassPathResource logoResource = new ClassPathResource(LOGO_PATH);
        if (!logoResource.exists()) {
            log.warn("Файл логотипа не найден: {}", LOGO_PATH);
            return null;
        }
        try (InputStream inputStream = logoResource.getInputStream()) {
            return IOUtils.toByteArray(inputStream);
        }
    }

    private String loadLogoAsBase64() throws IOException {
        byte[] logoBytes = loadLogoBytes();
        return logoBytes != null ? Base64.getEncoder().encodeToString(logoBytes) : null;
    }

    private void addEmptyParagraph(XWPFDocument document) {
        document.createParagraph();
    }

    private String formatPercentageForDocx(Double value) {
        if (value == null) return "N/A";
        // Assume value is already 0-100 range after potential multiplication
        return String.format(Locale.US, "%.2f%%", value);
    }

    private String formatPercentageForPdf(Double value) {
        if (value == null) return "N/A";
        // Assume value is already 0-100 range after potential multiplication
        return String.format(Locale.US, "%.2f%%", value);
    }

    // --- DOCX Table/Cell Styling Helpers ---
    // (Keep setTableWidth, removeTableBorders, setTableBorders, setCellBorders, setCellMargins, setCellVerticalAlignment)
    private void setTableWidth(XWPFTable table, String widthValue) { /* ... original code ... */ }
    private void removeTableBorders(XWPFTable table) { /* ... original code ... */ }
    private void setTableBorders(XWPFTable table, STBorder.Enum borderType, int size, String hexColor) { /* ... original code ... */ }
    private void setCellBorders(XWPFTableCell cell, STBorder.Enum borderType, int size, String hexColor) { /* ... original code ... */ }
    private void setCellMargins(XWPFTableCell cell, int top, int left, int bottom, int right) { /* ... original code ... */ }
    private void setCellVerticalAlignment(XWPFTableCell cell, STVerticalJc.Enum align) { /* ... original code ... */ }
}