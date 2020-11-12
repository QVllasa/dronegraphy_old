import {IUser} from './user.interface';

export interface Order {
  id: number;
  user: IUser;
  amount: number;
  payment: 'paypal' | 'other';
}
