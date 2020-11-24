import {Roles} from "./role.interface";

export interface IUser {
   uid: string;
   email: string;
   firstName: string;
   lastName: string;
   roles: Roles;
   emailVerified: boolean;
   // imgPath?: string;
   // activated?: boolean;
   // [videos: number]: Video[];
   // orders?: Order[];
   // favorites?: Video[];
   // saved?: IUser[];
   // job?: any;
}
