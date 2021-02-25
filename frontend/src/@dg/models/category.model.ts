// export interface ICategory {
//     id: string,
//     value: string,
//     parent_category?: ICategory
// }

// export interface IParentCategory{
//     id: string,
//     value: string
// }

export interface ICategory {
    id: string;
    value: string;
    children?: ICategory[];
    level?: number;
    expandable?: boolean;
}
