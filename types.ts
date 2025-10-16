export interface ProductMedia {
  type: 'image' | 'video';
  url: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  onSale?: boolean;
  media: ProductMedia[];
  stock: boolean;
  description?: string;
  category: string;
  color?: string[];
  featured?: boolean;
}

export interface LeatherInfo {
  leatherTypes: Array<{ name: string; description: string; }>;
  qualityHallmarks: Array<{ hallmark: string; description: string; }>;
  careTips: Array<{ tip: string; description: string; }>;
}
