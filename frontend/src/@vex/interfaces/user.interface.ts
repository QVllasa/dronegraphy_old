import {Roles} from "../../app/pages/auth/auth.component";

export interface IUser {
   uid: string;
   email: string;
   password?: string;
   firstName?: string;
   lastName?: string;
   country?: string;
   roles?: Roles;
   imgPath?: string;
   activated?: boolean;
   // [videos: number]: Video[];
   // orders?: Order[];
   // favorites?: Video[];
   // saved?: IUser[];
   // job?: any;
}
