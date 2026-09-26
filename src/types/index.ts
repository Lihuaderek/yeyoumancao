
export interface MerchantOption {
  id: string;
  name: string;
  priceOffset: number;
  image?: string;
  hex?: string;
  desc?: string;
}
export type GarmentCategory = string;
export type GarmentGender = 'men' | 'women' | 'unisex';

export interface Garment {
  merchantColors?: MerchantOption[];
  merchantFabrics?: MerchantOption[];
  merchantPatterns?: MerchantOption[];
  id: string;
  name: string;
  category: string;
  categoryName?: string;
  gender: GarmentGender;
  price: number;
  originalPrice?: number;
  image: string;
  overlayImage?: string;
  tryonImage?: string;
  description: string;
  details?: string[];
  fabrics?: string[];
  colors?: { name: string; hex: string; value: string }[];
  tags?: string[];
  isCustomizable?: boolean;
  canTryOn?: boolean;
  craftsmanship?: string;
  target?: string;
}

export interface User {
  username: string;
  password?: string;
  name?: string;
  createdAt?: string;
}

export interface CartItem {
  id: string;
  garmentId: string;
  title: string;
  image: string;
  price: number;
  size: string;
  color: string;
  colorName: string;
  fabric: string;
  fabricName: string;
  quantity: number;
}

export interface Order {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  consignee: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
}

export interface Designer {
  id: string;
  name: string;
  title: string;
  yearsOfExperience: number;
  avatar: string;
  description: string;
  specialty: string;
  worksCount: number;
}
