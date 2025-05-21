export interface GiftCategory {
  id: string;
  title: string;
  products: GiftProduct[];
}

export interface GiftProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
} 