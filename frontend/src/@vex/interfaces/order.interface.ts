import {User} from './user.interface';

export interface Order {
  id: number;
  user: User;
  amount: number;
  payment: 'paypal' | 'other';
}
