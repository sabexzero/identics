export interface IGetFoldersItemResponse {
    id: number;
    name: "string";
    childs: IGetFoldersItemResponse[];
}

export interface IGetFolders {
    userId: number;
    parentId?: number;
}
