import {Video} from './video.interface';
import {Order} from './order.interface';

export interface User {
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
   orders?: Order[];
   favorites?: Video[];
   saved?: User[];
   job?: any;
}
