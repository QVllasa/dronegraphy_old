import {User} from './user.model';
import {Deserializable} from "./deserialize.interface";

export interface ICategory {
    id: string;
    sub_category: string;
    parent_category: string;
}


