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
    checked?: boolean;
    expandable?: boolean;
    isExpanded?: boolean;
    id: string;
    value: string;
    key: number;
    parent_key?: number;
    level?: number;
}

