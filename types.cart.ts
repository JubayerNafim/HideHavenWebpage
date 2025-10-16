import { Product } from './types';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderDetails {
  name: string;
  address: string;
  phone: string;
  items: CartItem[];
  email?: string;
  note?: string;
  deliveryArea?: 'dhaka' | 'outside';
}
