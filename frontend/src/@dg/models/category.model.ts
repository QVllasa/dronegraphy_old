export interface IChildCategory {
    id: string,
    value: string,
    parent_category: IParentCategory
}

export interface IParentCategory{
    id: string,
    value: string
}
