import { Category, Product } from "../lib/types";

export const categories: Category[] = [
  { id: "all", name: "All" },
  { id: "fruits", name: "Fruits" },
  { id: "vegetables", name: "Vegetables" },
  { id: "snacks", name: "Snacks" },
  { id: "drinks", name: "Drinks" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Apple",
    description: "Fresh and crispy red apple.",
    price: 1.2,
    categoryId: "fruits",
    emoji: "🍎",
  },
  {
    id: "2",
    name: "Banana",
    description: "Sweet ripe banana.",
    price: 0.8,
    categoryId: "fruits",
    emoji: "🍌",
  },
  {
    id: "3",
    name: "Carrot",
    description: "Organic orange carrot.",
    price: 0.5,
    categoryId: "vegetables",
    emoji: "🥕",
  },
  {
    id: "4",
    name: "Broccoli",
    description: "Fresh green broccoli.",
    price: 1.5,
    categoryId: "vegetables",
    emoji: "🥦",
  },
  {
    id: "5",
    name: "Potato Chips",
    description: "Crunchy salted chips.",
    price: 2.0,
    categoryId: "snacks",
    emoji: "🍟",
  },
  {
    id: "6",
    name: "Chocolate Bar",
    description: "Rich milk chocolate.",
    price: 1.8,
    categoryId: "snacks",
    emoji: "🍫",
  },
  {
    id: "7",
    name: "Orange Juice",
    description: "Freshly squeezed orange juice.",
    price: 2.5,
    categoryId: "drinks",
    emoji: "🧃",
  },
  {
    id: "8",
    name: "Coffee",
    description: "Hot brewed coffee.",
    price: 2.2,
    categoryId: "drinks",
    emoji: "☕",
  },
];
