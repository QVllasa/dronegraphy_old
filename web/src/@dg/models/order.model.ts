import {User} from './user.model';
import {Video} from './video.model';

export interface Order {
  id: number;
  user: User;
  videos: Video[];
  amount: number;
  payment: 'paypal' | 'other';
}
