export interface IGetDocumentsTag {
    id: number;
}

export interface IGetTagsResponse {
    items: ITagsResponse[];
}

export interface ITagsResponse {
    id: number;
    name: string;
    hexString: string;
}

export interface IDeleteTag {
    id: number;
}
