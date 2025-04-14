export interface IGetTags {
    userId: number;
}

export interface IGetDocumentsTag extends IGetTags {
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

export interface ICreateTagResponse extends Omit<ITagsResponse, "id"> {
    userId: number;
}

export interface IDeleteTag {
    id: number;
    userId: number;
}

export interface IEditTag extends ITagsResponse {
    userId: number;
}
