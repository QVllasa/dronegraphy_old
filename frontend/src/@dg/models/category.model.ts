import {User} from './user.model';
import {Deserializable} from "./deserialize.interface";

export interface ICategory {
    id: string;
    value: string;
    createdAt: Date;
    updatedAt: Date
}


