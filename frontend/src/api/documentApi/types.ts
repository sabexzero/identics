interface IUserIdBase {
    userId: number;
    id: number;
}

interface ITagsBase {
    id: number;
    name: string;
    userId: number;
}

// ==================== Запросы ====================
export interface IUpdateDocument {
    userId: number;
    title: string;
}

export interface IGetDocuments {
    page: number;
    size: number;
    userId: number;
    tagIds?: number[];
    search?: string;
    sortBy?: "title" | "date";
    sortDirection?: "asc" | "desc";
}

export interface IGetDocumentById {
    userId: number;
    id: number;
}

export interface IUploadTextDocument extends IUpdateDocument {
    content: string;
    userIds?: number[];
}

export interface IUploadFileDocument extends IUpdateDocument {
    file: File;
}

export interface IAdditionalDocumentCheck extends IUserIdBase {
    plagiarism: boolean;
    ai: boolean;
}

// ==================== Ответы ====================
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
    date: string;
    wordCount: number;
    similarity: number;
    uniqueness: number;
    aiContent: number;
    status: string;
    processingTime: string;
    highlights: {
        id: string;
        text: string;
        highlighted: boolean;
        similarity: number;
        source: string;
    }[];
    sources: {
        id: string;
        title: string;
        url: string;
        author: string;
        year: number;
        similarity: number;
        matchedWords: number;
    }[];
    tags: {
        id: number;
        name: string;
        hexString: string;
    }[];
}

export interface IEditDocumentTags extends IUserIdBase {
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

export interface IEditDocument extends IUserIdBase {
    tagsIds: number[];
    title: string;
}
