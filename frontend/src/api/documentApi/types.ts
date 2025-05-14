interface ITagsBase {
    id: number;
    name: string;
}

// ==================== Запросы ====================
export interface IUpdateDocument {
    title: string;
}

export interface IGetDocuments {
    page: number;
    size: number;
    tagIds?: number;
    searchTerm?: string;
    sortBy?: "title" | "date";
    sortDirection?: "asc" | "desc";
}

export interface IGetDocumentById {
    id: number;
}

export interface IUploadTextDocument extends IUpdateDocument {
    content: string;
}

export interface IUploadFileDocument extends IUpdateDocument {
    file: File;
}

export interface IAdditionalDocumentCheck {
    id: number;
    plagiarism: boolean;
    ai: boolean;
}

export interface IGetDocumentsResponse {
    totalElements: number;
    totalPages: number;
    size: number;
    content: {
        id: number;
        title: string;
        userId: number;
        checkDate: string;
        uniqueness: number;
        aiLevel: number;
        tags: {
            id: number;
            name: string;
            hexString: string;
        }[];
        reportUrl: string;
    }[];
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    pageable: {
        offset: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        pageSize: number;
        paged: boolean;
        pageNumber: number;
        unpaged: boolean;
    };
    numberOfElements: 0;
    first: true;
    last: true;
    empty: true;
}

export interface IGetDocumentByIdResponse {
    title: string;
    checkDate: string;
    wordCount: number;
    uniqueness: number;
    aiContent: number;
    reportUrl: string;
    processingTime: number;
    sources: {
        sourceInfo: string;
        sourceUrl: string;
        firstPos: number;
        secondPos: number;
        text: string;
        startCharIndex: number;
        endCharIndex: number;
    }[];
    tags: {
        id: number;
        name: string;
        hexString: string;
    }[];
}

export interface IEditDocumentTags {
    id: number;
    tagsIds: number[];
}

export interface IUploadDocumentResponse {
    id: number;
    title: string;
    userId: number;
    checkDate: string;
    plagiarismLevel: number;
    aiCheckLevel: number;
    tags: ITagsBase[];
}

export interface IEditDocument {
    id: number;
    tagsIds: number[];
    title: string;
}

export interface IUploadInfoForReport {
    id: number;
    university: string;
    student: string;
    reviewer: string;
    department: string;
    format: string;
}

export interface IUploadInfoForReportResponse {
    url: string;
}
