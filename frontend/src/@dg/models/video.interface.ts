import {IUser} from './user.model';

export interface Video {
   id: number;
   title: string;
   creator: IUser;
   location: string;
   poster: string;
   itemPath: string;
   formats: string[];
   res: string;
   length: string;
   fps: number;
   camera: string;
   tags: string[];
   category: string[];
   sell: boolean;
   downloads: number;
   views: number;
   upload: Date;
   profileBackground: boolean;
   chosen: boolean;
}
