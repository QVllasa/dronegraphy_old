export interface IUser {
   userId: string;
   email: string;
   password?: string;
   firstName?: string;
   lastName?: string;
   country?: string;
   role?: 'admin' | 'pilot' | 'standard';
   imgPath?: string;
   activated?: boolean;
   // [videos: number]: Video[];
   // orders?: Order[];
   // favorites?: Video[];
   // saved?: IUser[];
   // job?: any;
}
