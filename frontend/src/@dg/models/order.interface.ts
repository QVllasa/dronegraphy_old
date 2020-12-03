import {IUser} from './user.model';

export interface Order {
  id: number;
  user: IUser;
  amount: number;
  payment: 'paypal' | 'other';
}
