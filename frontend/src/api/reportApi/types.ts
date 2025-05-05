enum ReportFormat {
    pdf = "pdf",
    html = "html",
}

export interface IGetReport {
    userId: number;
    id: number;
    format: ReportFormat;
}

export interface IGetReportResponse {
    url: string;
}
