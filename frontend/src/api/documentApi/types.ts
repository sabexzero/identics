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
    content: {
        id: number;
        title: string;
        userId: number;
        checkDate: string;
        uniqueness: number | null;
        aiLevel: number | null;
        tags: ITagsBase[];
    }[];
    empty: string;
    last: boolean;
    first: boolean;
    number: number;
    numberOfElement: number;
    size: number;
    totalPages: number;
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

export interface IEditDocument extends IUserIdBase {
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
