export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  emoji: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
