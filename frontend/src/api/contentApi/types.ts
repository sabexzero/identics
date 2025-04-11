export interface IGetPaginationContent {
    page: number;
    perPage: number;
    userId: number;
    folderId: number | null;
}

export interface IGetPaginationContentResponse {
    content: {
        aiCheckLevel: null | number;
        aiCheckStatus: null | number;
        contentType: null | string;
        dateTime: null | string;
        folderId: null | number;
        id: number;
        plagiarismCheckStatus: null | string;
        plagiarismLevel: null | number;
        title: string;
        userId: number;
    }[];
    empty: string;
    last: boolean;
    first: boolean;
    number: number;
    numberOfElement: number;
    size: number;
    totalPages: number;
}
